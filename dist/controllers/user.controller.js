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
exports.deleteUserLogic = exports.logoutLogic = exports.loginLogic = exports.signupLogic = void 0;
const user_model_1 = require("../models/user.model");
const url_model_1 = require("../models/url.model");
const user_validation_1 = require("../validations/user.validation");
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
const userId_utils_1 = require("../utils/userId.utils");
const ioredis_1 = require("ioredis");
const console_1 = require("console");
(0, dotenv_1.config)();
const expiration = 60 * 60 * 24 * 3;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const REDIS_URI = process.env.REDIS_URI;
const redis = new ioredis_1.Redis(REDIS_URI);
function createJwtToken(id) {
    // log({ id, expiration });
    if (JWT_SECRET_KEY !== undefined) {
        return (0, jsonwebtoken_1.sign)({ id }, JWT_SECRET_KEY, { expiresIn: expiration });
    }
    throw Error("JWT_SECRET_KEY is undefined");
}
function signupLogic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, console_1.log)({ reqBody: req.body });
            if (Object.keys(req.body).length === 0)
                return res.status(400).json({ errMsg: `bad request` });
            const validatedUser = user_validation_1.ZSignupSchema.safeParse(req.body);
            const successStatus = validatedUser.success;
            if (!successStatus) {
                const errMsg = validatedUser.error.issues[0].message;
                return res.status(400).json({ errMsg });
            }
            const userExist = yield user_model_1.UserModel.findOne({
                $or: [
                    { email: validatedUser.data.email },
                    { username: validatedUser.data.username },
                ],
            });
            if (userExist)
                return res.status(400).json({ errMsg: `User already exists` });
            const signupData = validatedUser.data;
            const newUser = new user_model_1.UserModel(signupData);
            const savedUser = yield newUser.save();
            const jwtToken = createJwtToken(savedUser._id.toString());
            res.cookie("jwt", jwtToken, {
                httpOnly: true,
                maxAge: expiration * 1000,
                sameSite: "lax",
                secure: true,
            });
            res.status(201).json({ signup: true });
        }
        catch (err) {
            res.status(500).render("500-page");
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            (0, console_1.log)(err);
        }
    });
}
exports.signupLogic = signupLogic;
function loginLogic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, console_1.log)({ reqBody: req.body });
            if (Object.keys(req.body).length === 0)
                return res.status(400).json({ errMsg: `bad request` });
            const { emailOrUsername, password } = req.body;
            (0, console_1.log)({ emailOrUsername, password });
            const authenticatedUser = yield user_model_1.UserModel.authenticate(emailOrUsername, password);
            const jwtToken = createJwtToken(authenticatedUser._id);
            res.cookie("jwt", jwtToken, {
                httpOnly: true,
                maxAge: expiration * 1000,
                sameSite: "lax",
                secure: true,
            });
            res.status(200).json({ login: true });
        }
        catch (err) {
            res
                .status(401)
                .json({ errMsg: "Invalid email (or username) and password" });
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            (0, console_1.log)(err);
        }
    });
}
exports.loginLogic = loginLogic;
function logoutLogic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.clearCookie("jwt");
            res.status(302).redirect("/scissor/homepage");
        }
        catch (err) {
            res.status(500).render("500-page");
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            return (0, console_1.log)(err);
        }
    });
}
exports.logoutLogic = logoutLogic;
function deleteUserLogic(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, console_1.log)({ jwtToken: (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt, JWT_SECRET_KEY });
            const userId = (0, userId_utils_1.generateUserId)((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.jwt, JWT_SECRET_KEY);
            // delete user's url documents in mongodb url collection and redis cache:
            const urlDocuments = yield url_model_1.UrlModel.find({ userId });
            const redisKeys = urlDocuments.map((urlDoc) => {
                return urlDoc.shortUrl;
            });
            // if user's url presently exists in the cache, delete it:
            if (redisKeys.length >= 1) {
                const deletedRedisKey = yield redis.del(...redisKeys);
                (0, console_1.log)({ deletedRedisKey });
            }
            const deletedUrls = yield url_model_1.UrlModel.deleteMany({ userId }); // delete user's URLs
            const deletedUser = yield user_model_1.UserModel.deleteOne({ _id: userId }); // delete user's account
            (0, console_1.log)({ urlDocuments, redisKeys, deletedUrls, deletedUser });
            res.clearCookie("jwt");
            res.status(200).json({ accountDeleted: true });
        }
        catch (err) {
            res.status(500).render("500-page");
            if (err instanceof Error)
                return (0, console_1.log)(err.message);
            return (0, console_1.log)(err);
        }
    });
}
exports.deleteUserLogic = deleteUserLogic;
