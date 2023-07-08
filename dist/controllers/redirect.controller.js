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
Object.defineProperty(exports, "__esModule", { value: true });
exports.homepageRedirect = exports.getRedirect = void 0;
const dotenv_1 = require("dotenv");
const url_model_1 = require("../models/url.model");
const ioredis_1 = require("ioredis");
(0, dotenv_1.config)();
const REDIS_URI = process.env.REDIS_URI;
const redis = new ioredis_1.Redis(REDIS_URI);
// @route GET /
// @desc redirects from '/' to '/scissor/homepage' (i.e the homepage)
function homepageRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(302).redirect(`http://${req.get('host')}/scissor/homepage`);
        }
        catch (err) {
            res.status(500).render('500-page');
            if (err instanceof Error)
                return console.log(err.message);
            return console.log(err);
        }
    });
}
exports.homepageRedirect = homepageRedirect;
// @route GET /:id
// @desc redirects from short url to long url
function getRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { url } = req;
            console.log({ url });
            const shortUrl = req.get('host') + url;
            function analytics(doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    doc.clicks += 1;
                    doc.clickDetails.push({
                        timestamp: new Date(),
                        referrer: req.headers.referer,
                        userAgent: req.headers['user-agent'],
                    });
                    yield doc.save();
                });
            }
            let LongUrl = yield redis.get(shortUrl);
            if (LongUrl) {
                let cachedLongUrl = LongUrl;
                cachedLongUrl = JSON.parse(cachedLongUrl);
                console.log({ cachedLongUrl, 'source': 'cache' });
                res.status(302).redirect(cachedLongUrl);
                const urlDocument = yield url_model_1.UrlModel.findOne({ shortUrl });
                analytics(urlDocument);
                return;
            }
            const urlDocument = yield url_model_1.UrlModel.findOne({ shortUrl });
            if (urlDocument) {
                const dbLongUrl = urlDocument.longUrl;
                yield redis.set(shortUrl, JSON.stringify(dbLongUrl));
                console.log({ dbLongUrl, 'source': 'database' });
                res.status(302).redirect(dbLongUrl);
                analytics(urlDocument);
            }
            else {
                res.status(404).render('short-url-error');
            }
        }
        catch (err) {
            res.status(500).render('500-page');
            if (err instanceof Error) {
                console.log(err.message);
            }
            else {
                console.log(err);
            }
        }
    });
}
exports.getRedirect = getRedirect;
