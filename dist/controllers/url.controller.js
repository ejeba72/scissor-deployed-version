"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUrl = exports.updateUrl = exports.deleteQrcodeImages = exports.getDashboard = exports.postNewShortUrl = void 0;
const valid_url_1 = require("valid-url");
const shortid_1 = require("shortid");
const dotenv_1 = require("dotenv");
const url_model_1 = require("../models/url.model");
const url_validation_1 = require("../validations/url.validation");
const qrcode_util_1 = require("../utils/qrcode.util");
const path_1 = require("path");
const userId_utils_1 = require("../utils/userId.utils");
const promises_1 = require("fs/promises");
const console_1 = require("console");
const ioredis_1 = require("ioredis");
const node_url_1 = __importDefault(require("node:url"));
(0, dotenv_1.config)();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const REDIS_URI = process.env.REDIS_URI;
const redis = new ioredis_1.Redis(REDIS_URI);
// @route POST /api/v1
// @desc create short url  Response<any, Record<string, any>>
function postNewShortUrl(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (Object.keys(req.body).length === 0)
                return res.status(400).json({ errMsg: `bad request` });
            const validatedUrl = url_validation_1.ZUrlSchema.safeParse(req.body);
            const successStatus = validatedUrl.success;
            if (!successStatus) {
                const errMsg = validatedUrl.error.issues[0].message;
                return res.status(400).json(errMsg);
            }
            const { longUrl, customUrl, qrcodeRequested } = validatedUrl.data;
            let shortUrl;
            // long url validation
            if ((0, valid_url_1.isUri)(longUrl)) {
                const existingLongUrl = yield url_model_1.UrlModel.findOne({ longUrl });
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
                    const existingShortUrl = yield url_model_1.UrlModel.findOne({ shortUrl });
                    if (existingShortUrl) {
                        const resMsg = {
                            errMsg: `Hey, that short url already exist. Here it is: SHORT URL: "${existingShortUrl.shortUrl}", LONG URL: "${existingShortUrl.longUrl}"`,
                        };
                        res.status(200).send(resMsg);
                        return;
                    }
                }
                else {
                    urlCode = (0, shortid_1.generate)(); // @desc typical code generated: 5E7zAwSfG
                }
                shortUrl = req.get("host") + "/" + urlCode;
                // qrcode section
                const qrcodeFileName = urlCode + ".png";
                const qrcodeFilePath = (0, path_1.join)(__dirname, "..", "..", "public", "img", qrcodeFileName);
                let qrcodeFileLocation = "";
                if (qrcodeRequested) {
                    yield (0, qrcode_util_1.qrGenerator)(qrcodeFilePath, shortUrl);
                    qrcodeFileLocation = "/img/" + qrcodeFileName;
                }
                // retrieve userId from jwt cookie
                const userId = (0, userId_utils_1.generateUserId)((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt, JWT_SECRET_KEY);
                // create model and save to db
                const newShortUrl = new url_model_1.UrlModel({
                    qrcodeFileLocation,
                    userId,
                    shortUrl,
                    longUrl,
                    qrcodeRequested,
                });
                yield newShortUrl.save();
                // response to client
                res.status(201).json({
                    qrcodeFileLocation,
                    shortUrlCreated: true,
                    resMsg: `Short url created! Short Url: "${shortUrl}", ${(0, qrcode_util_1.qrcodeResMsg)(qrcodeRequested)}, Long url: "${longUrl}."`,
                });
                // if (qrcodeRequested) {
                //     await deleteQrcodeImage(qrcodeFilePath);
                // }
            }
            else {
                res.status(404).json({ errMsg: `Please enter a valid long url.` });
            }
        }
        catch (err) {
            res.status(500).render("500-page");
            if (err instanceof Error)
                return (0, console_1.error)(err.message);
            (0, console_1.error)(err);
        }
    });
}
exports.postNewShortUrl = postNewShortUrl;
// @route GET /api/v1
// @desc render dashboard page
function getDashboard(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, userId_utils_1.generateUserId)((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt, JWT_SECRET_KEY);
            // log({ userId });
            const urlCollection = yield url_model_1.UrlModel.find({ userId });
            const qrcodeDocs = urlCollection.filter((doc) => {
                return doc.qrcodeRequested === true;
            });
            const generatorParams = qrcodeDocs.map((doc) => {
                return {
                    qrcodeFilePath: (0, path_1.join)(__dirname, "..", "..", "public", doc.qrcodeFileLocation),
                    shortUrl: doc.shortUrl,
                };
            });
            generatorParams.forEach((params) => {
                function generatorFunction() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield (0, qrcode_util_1.qrGenerator)(params.qrcodeFilePath, params.shortUrl);
                    });
                }
                generatorFunction();
            });
            res.status(200).render("dashboard", { urlCollection, isDashboard: true });
        }
        catch (err) {
            res.status(500).render("500-page");
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            (0, console_1.log)(err);
        }
    });
}
exports.getDashboard = getDashboard;
// @route DELETE /api/v1
// @desc deletes the QRCode images that have been loaded in the dashboard page
function deleteQrcodeImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dirPath = (0, path_1.join)(__dirname, "..", "..", "public", "img");
            const files = yield (0, promises_1.readdir)(dirPath);
            // log({filesBeforeDel: files});
            const deleteFilePromises = files.map((file) => (0, promises_1.unlink)((0, path_1.join)(dirPath, file)));
            yield Promise.all(deleteFilePromises);
            // log(`bad guy!`);
            res.status(200).send(); // empty response is intentional
        }
        catch (err) {
            res.status(500).send();
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            return (0, console_1.log)(err);
        }
    });
}
exports.deleteQrcodeImages = deleteQrcodeImages;
// @route UPDATE /api/v1
// @desc logic for the 'Edit short URL' form on the dashboard page
function updateUrl(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
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
            (0, console_1.log)({ reqBody: req.body });
            const userId = (0, userId_utils_1.generateUserId)((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt, JWT_SECRET_KEY); // retrieve userId from jwt cookie
            if (longUrl !== "" && !(0, valid_url_1.isUri)(longUrl)) {
                (0, console_1.log)({ errMsg: `Please enter a valid long URL` });
                return res.status(404).json({ errMsg: `Please enter a valid long URL` });
            }
            const urlToEdit = yield url_model_1.UrlModel.findOne({
                $and: [{ userId }, { shortUrl: findUrlToEdit }],
            });
            (0, console_1.log)({ urlToEdit });
            if (!urlToEdit) {
                (0, console_1.log)({ resMsg: `URL not found! Or may have already been modified.` });
                return res.status(404).json({
                    errMsg: "URL not found! Or may have already been modified.",
                });
            }
            let proposedShortUrl;
            if (customUrl === "") {
                proposedShortUrl = urlToEdit.shortUrl;
            }
            else {
                proposedShortUrl = req.get("host") + "/" + customUrl;
            }
            let proposedLongUrl;
            if (longUrl === "") {
                proposedLongUrl = urlToEdit.longUrl;
            }
            else {
                proposedLongUrl = longUrl;
            }
            if (proposedShortUrl === urlToEdit.shortUrl &&
                proposedLongUrl === urlToEdit.longUrl &&
                qrcodeRequested === urlToEdit.qrcodeRequested) {
                (0, console_1.log)({ errMsg: `No changes to make.` });
                return res.status(404).json({ errMsg: `No changes to make.` });
            }
            // qrcode section
            let urlCode;
            if (!customUrl) {
                urlCode = (_b = node_url_1.default.parse(urlToEdit.shortUrl).pathname) === null || _b === void 0 ? void 0 : _b.split("/").pop();
            }
            else {
                urlCode = customUrl;
            }
            const qrcodeFileName = urlCode + ".png";
            const qrcodeFilePath = (0, path_1.join)(__dirname, "..", "..", "public", "img", qrcodeFileName);
            let qrcodeFileLocation = "";
            if (qrcodeRequested) {
                yield (0, qrcode_util_1.qrGenerator)(qrcodeFilePath, proposedShortUrl);
                qrcodeFileLocation = "/img/" + qrcodeFileName;
            }
            // edit and save url:
            urlToEdit.longUrl = proposedLongUrl;
            urlToEdit.shortUrl = proposedShortUrl;
            urlToEdit.qrcodeRequested = qrcodeRequested;
            urlToEdit.qrcodeFileLocation = qrcodeFileLocation;
            const editedUrl = yield urlToEdit.save();
            const deletedRedisKey = yield redis.del(findUrlToEdit); // delete url if it exists in Redis cache
            (0, console_1.log)({ deletedRedisKey });
            // response to client
            res.status(201).json({
                qrcodeFileLocation,
                shortUrlEdited: true,
                resMsg: `Short url updated! Short Url: "${editedUrl.shortUrl}", ${(0, qrcode_util_1.qrcodeResMsg)(editedUrl.qrcodeRequested)}, Long url: "${editedUrl.longUrl}."`,
            });
        }
        catch (err) {
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            return (0, console_1.log)(err);
            res.status(500).render("500-page");
        }
    });
}
exports.updateUrl = updateUrl;
// @route DELETE /api/v1
// @desc logic for the 'Delete short URL' form on the dashboard page
function deleteUrl(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, console_1.log)({ reqBody: req.body });
            const { findUrl, deleteAll } = req.body; // retrieve the payload from the request body
            (0, console_1.log)({ findUrl, deleteAll });
            const userId = (0, userId_utils_1.generateUserId)((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt, JWT_SECRET_KEY); // retrieve userId from jwt cookie
            if (deleteAll) {
                const urlDocuments = yield url_model_1.UrlModel.find({ userId });
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
                    const deletedRedisKeys = yield redis.del(...redisKeys);
                    (0, console_1.log)({ deletedRedisKeys });
                }
                const deletedMany = yield url_model_1.UrlModel.deleteMany({ userId });
                (0, console_1.log)({ deletedMany });
                return res.status(200).json({ resMsgDelUrl: `deleted all URLs` });
            }
            const deletedRedisKey = yield redis.del(findUrl); // delete url if it exists in Redis cache
            const deletedOne = yield url_model_1.UrlModel.deleteOne({
                $and: [{ userId }, { shortUrl: findUrl }],
            });
            (0, console_1.log)({ deletedOne, deletedRedisKey });
            if (deletedOne.deletedCount === 0 && deletedRedisKey === 0)
                return res.status(404).json({
                    resMsgDelUrl: `That URL does not exist or has already been deleted`,
                });
            // The if statement's condition should have been, "if (deletedOne.deletedCount===0) {}", however, i decided to go with the above condition for the sake of redundancy or what i may not have considered
            res.status(200).json({ resMsgDelUrl: `URL deleted!` });
        }
        catch (err) {
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            return (0, console_1.log)(err);
            res.status(500).render("500-page");
        }
    });
}
exports.deleteUrl = deleteUrl;
