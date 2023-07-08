import { Request, Response } from "express";
import { isUri } from "valid-url";
import { generate } from "shortid";
import { config } from "dotenv";
import { UrlModel } from "../models/url.model";
import { ZUrlSchema } from "../validations/url.validation";
import { qrGenerator, qrcodeResMsg } from "../utils/qrcode.util";
import { join } from "path";
import { GetPublicKeyOrSecret, Secret, verify } from "jsonwebtoken";
import { generateUserId } from "../utils/userId.utils";
import { readdir, unlink } from "fs/promises";
import { error, log } from "console";
import { Redis } from "ioredis";
import url from "node:url";

config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as
  | Secret
  | GetPublicKeyOrSecret;
const REDIS_URI = process.env.REDIS_URI;
const redis = new Redis(REDIS_URI);

// @route POST /api/v1
// @desc create short url  Response<any, Record<string, any>>
async function postNewShortUrl(req: Request, res: Response): Promise<unknown> {
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ errMsg: `bad request` });
    const validatedUrl = ZUrlSchema.safeParse(req.body);
    const successStatus = validatedUrl.success;
    if (!successStatus) {
      const errMsg = validatedUrl.error.issues[0].message;
      return res.status(400).json(errMsg);
    }
    const { longUrl, customUrl, qrcodeRequested } = validatedUrl.data;
    let shortUrl: string;
    // long url validation
    if (isUri(longUrl)) {
      const existingLongUrl = await UrlModel.findOne({ longUrl });
      if (existingLongUrl) {
        const resMsg = {
          errMsg: `Hey, you previously created a short url for that link. Here it is: SHORT URL: "${existingLongUrl.shortUrl}", LONG URL: "${existingLongUrl.longUrl}"`,
        };
        res.status(200).send(resMsg);
        return;
      }
      let urlCode;
      if (customUrl) {
        urlCode = customUrl;
        shortUrl = req.get("host") + "/" + urlCode;
        const existingShortUrl = await UrlModel.findOne({ shortUrl });
        if (existingShortUrl) {
          const resMsg = {
            errMsg: `Hey, that short url already exist. Here it is: SHORT URL: "${existingShortUrl.shortUrl}", LONG URL: "${existingShortUrl.longUrl}"`,
          };
          res.status(200).send(resMsg);
          return;
        }
      } else {
        urlCode = generate(); // @desc typical code generated: 5E7zAwSfG
      }
      shortUrl = req.get("host") + "/" + urlCode;
      // qrcode section
      const qrcodeFileName = urlCode + ".png";
      const qrcodeFilePath = join(
        __dirname,
        "..",
        "..",
        "public",
        "img",
        qrcodeFileName
      );
      let qrcodeFileLocation = "";
      if (qrcodeRequested) {
        await qrGenerator(qrcodeFilePath, shortUrl);
        qrcodeFileLocation = "/img/" + qrcodeFileName;
      }
      // retrieve userId from jwt cookie
      const userId = generateUserId(req.cookies?.jwt, JWT_SECRET_KEY);
      // create model and save to db
      const newShortUrl = new UrlModel({
        qrcodeFileLocation,
        userId,
        shortUrl,
        longUrl,
        qrcodeRequested,
      });
      await newShortUrl.save();
      // response to client
      res.status(201).json({
        qrcodeFileLocation,
        shortUrlCreated: true,
        resMsg: `Short url created! Short Url: "${shortUrl}", ${qrcodeResMsg(
          qrcodeRequested
        )}, Long url: "${longUrl}."`,
      });
      // if (qrcodeRequested) {
      //     await deleteQrcodeImage(qrcodeFilePath);
      // }
    } else {
      res.status(404).json({ errMsg: `Please enter a valid long url.` });
    }
  } catch (err: unknown) {
    res.status(500).render("500-page");
    if (err instanceof Error) return error(err.message);
    error(err);
  }
}
// @route GET /api/v1
// @desc render dashboard page
async function getDashboard(req: Request, res: Response) {
  try {
    const userId = generateUserId(req.cookies?.jwt, JWT_SECRET_KEY);
    // log({ userId });
    const urlCollection = await UrlModel.find({ userId });
    const qrcodeDocs = urlCollection.filter((doc) => {
      return doc.qrcodeRequested === true;
    });
    const generatorParams = qrcodeDocs.map((doc) => {
      return {
        qrcodeFilePath: join(
          __dirname,
          "..",
          "..",
          "public",
          doc.qrcodeFileLocation
        ),
        shortUrl: doc.shortUrl,
      };
    });
    generatorParams.forEach((params) => {
      async function generatorFunction() {
        await qrGenerator(params.qrcodeFilePath, params.shortUrl);
      }
      generatorFunction();
    });
    res.status(200).render("dashboard", { urlCollection, isDashboard: true });
  } catch (err: unknown) {
    res.status(500).render("500-page");
    if (err instanceof Error) return log(err.message);
    log(err);
  }
}
// @route DELETE /api/v1
// @desc deletes the QRCode images that have been loaded in the dashboard page
async function deleteQrcodeImages(req: Request, res: Response) {
  try {
    const dirPath = join(__dirname, "..", "..", "public", "img");
    const files = await readdir(dirPath);
    // log({filesBeforeDel: files});
    const deleteFilePromises = files.map((file) => unlink(join(dirPath, file)));
    await Promise.all(deleteFilePromises);
    // log(`bad guy!`);
    res.status(200).send(); // empty response is intentional
  } catch (err: unknown) {
    res.status(500).send();
    if (err instanceof Error) return log(err.message);
    return log(err);
  }
}
// @route UPDATE /api/v1
// @desc logic for the 'Edit short URL' form on the dashboard page
async function updateUrl(req: Request, res: Response) {
  /* 
  STEPS(INITIAL IDEAS):
  ==> Find out if the shortUrl to edit even exist in the db.
  ==> If it doesn't exist in the db, then check the cache to ensure that the key-value pair associated with the shortUrl is not present in the cache. 
  ==>  If such key value-pair exists in the cache, then deleted it from the cache.
  ==> Then return a response to the client indicating that such shortUrl does not exist.
  ==> Conversely, if the shortUrl to be edited exists in the db, check which user account it is associated with.
  ==> If it is associated with the user account making the request to edit it, then go ahead to effect the requested changes.
  ==> Also, check the cache to ensure that the key-value pair for the edited url does not exist in the cache.
  ==> If it does, then delete such outdated key-value pair from the cache.
  ==> Now, if the short url to edit, exist in the database, but is associated with another account other than the client who requested for it, send a 401 response and with the authorization forbidden message...
  ==> On a second thought, no need for some of these steps. Because, it may not be best practise to give cues or clues to clients that a resource may exist, and may belong to another user. Consequently, I will remodify my steps to be simpler and not superflous:
  STEPS (IMPROVED IDEAS):
  ** Find out if the shortUrl to edit even exist and is associated with the user account requesting for the changes.
  ** If these two criteria are not satisfied, then send a 404 response with the following message: "URL not found!"
  ** Don't bother to check the cache for any clean up relating to such shortUrl. Because, the shortUrl could belong to another user.
  ** If the two criteria are satisfied, then go ahead to effect the requested changes.
  ** Then check the cache to ensure that the old key-value pair for the edited url does not exist in the cache.
  ** If it does, then delete such outdated key-value pair from the cache.
  ** Send a success response to the client.
  */
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).json({ errMsg: `bad request` });
    const { findUrlToEdit, longUrl, customUrl, qrcodeRequested } = req.body;
    log({ reqBody: req.body });
    const userId = generateUserId(req.cookies?.jwt, JWT_SECRET_KEY); // retrieve userId from jwt cookie
    if (longUrl !== "" && !isUri(longUrl)) {
      log({ errMsg: `Please enter a valid long URL` });
      return res.status(404).json({ errMsg: `Please enter a valid long URL` });
    }
    const urlToEdit = await UrlModel.findOne({
      $and: [{ userId }, { shortUrl: findUrlToEdit }],
    });
    log({ urlToEdit });
    if (!urlToEdit) {
      log({ resMsg: `URL not found! Or may have already been modified.` });
      return res.status(404).json({
        errMsg: "URL not found! Or may have already been modified.",
      });
    }
    let proposedShortUrl;
    if (customUrl === "") {
      proposedShortUrl = urlToEdit.shortUrl;
    } else {
      proposedShortUrl = req.get("host") + "/" + customUrl;
    }
    let proposedLongUrl;
    if (longUrl === "") {
      proposedLongUrl = urlToEdit.longUrl;
    } else {
      proposedLongUrl = longUrl;
    }
    if (
      proposedShortUrl === urlToEdit.shortUrl &&
      proposedLongUrl === urlToEdit.longUrl &&
      qrcodeRequested === urlToEdit.qrcodeRequested
    ) {
      log({ errMsg: `No changes to make.` });
      return res.status(404).json({ errMsg: `No changes to make.` });
    }
    // qrcode section
    let urlCode;
    if (!customUrl) {
      urlCode = url.parse(urlToEdit.shortUrl).pathname?.split("/").pop();
    } else {
      urlCode = customUrl;
    }
    const qrcodeFileName = urlCode + ".png";
    const qrcodeFilePath = join(
      __dirname,
      "..",
      "..",
      "public",
      "img",
      qrcodeFileName
    );
    let qrcodeFileLocation = "";
    if (qrcodeRequested) {
      await qrGenerator(qrcodeFilePath, proposedShortUrl);
      qrcodeFileLocation = "/img/" + qrcodeFileName;
    }
    // edit and save url:
    urlToEdit.longUrl = proposedLongUrl;
    urlToEdit.shortUrl = proposedShortUrl;
    urlToEdit.qrcodeRequested = qrcodeRequested;
    urlToEdit.qrcodeFileLocation = qrcodeFileLocation;
    const editedUrl = await urlToEdit.save();
    const deletedRedisKey = await redis.del(findUrlToEdit); // delete url if it exists in Redis cache
    log({ deletedRedisKey });
    // response to client
    res.status(201).json({
      qrcodeFileLocation,
      shortUrlEdited: true,
      resMsg: `Short url updated! Short Url: "${editedUrl.shortUrl}", ${qrcodeResMsg(
        editedUrl.qrcodeRequested
      )}, Long url: "${editedUrl.longUrl}."`,
    });
  } catch (err: unknown) {
    if (err instanceof Error) return log(err.message);
    return log(err);
    res.status(500).render("500-page");
  }
}
// @route DELETE /api/v1
// @desc logic for the 'Delete short URL' form on the dashboard page
async function deleteUrl(req: Request, res: Response) {
  try {
    log({ reqBody: req.body });
    const { findUrl, deleteAll } = req.body; // retrieve the payload from the request body
    log({ findUrl, deleteAll });
    const userId = generateUserId(req.cookies?.jwt, JWT_SECRET_KEY); // retrieve userId from jwt cookie

    if (deleteAll) {
      const urlDocuments = await UrlModel.find({ userId });
      console.log({ noOfUrlDocuments: urlDocuments.length });
      if (urlDocuments.length === 0)
        return res.status(404).json({
          resMsgDelUrl: `No URL is presently associated with your account`,
        });
      const redisKeys = urlDocuments.map((urlDoc) => {
        return urlDoc.shortUrl;
      });
      // if user's urls presently exist in Redis cache, delete it:
      if (redisKeys.length >= 1) {
        const deletedRedisKeys = await redis.del(...redisKeys);
        log({ deletedRedisKeys });
      }
      const deletedMany = await UrlModel.deleteMany({ userId });
      log({ deletedMany });
      return res.status(200).json({ resMsgDelUrl: `deleted all URLs` });
    }
    const deletedRedisKey = await redis.del(findUrl); // delete url if it exists in Redis cache
    const deletedOne = await UrlModel.deleteOne({
      $and: [{ userId }, { shortUrl: findUrl }],
    });
    log({ deletedOne, deletedRedisKey });
    if (deletedOne.deletedCount === 0 && deletedRedisKey === 0)
      return res.status(404).json({
        resMsgDelUrl: `That URL does not exist or has already been deleted`,
      });
    // The if statement's condition should have been, "if (deletedOne.deletedCount===0) {}", however, i decided to go with the above condition for the sake of redundancy or what i may not have considered
    res.status(200).json({ resMsgDelUrl: `URL deleted!` });
  } catch (err: unknown) {
    if (err instanceof Error) return log(err.message);
    return log(err);
    res.status(500).render("500-page");
  }
}

export {
  postNewShortUrl,
  getDashboard,
  deleteQrcodeImages,
  updateUrl,
  deleteUrl,
};
