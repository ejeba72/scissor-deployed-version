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
exports.checkUser = exports.verifyJwtToken = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
(0, dotenv_1.config)();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
function verifyJwtToken(req, res, next) {
    var _a, _b;
    console.log(`verifyJwtToken is been used`);
    const jwtToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    const referer = (_b = req.headers) === null || _b === void 0 ? void 0 : _b.referer;
    if (referer === "http://localhost:1111/scissor/login")
        return next(); // the debugging that led to this line of code suffer me ehn!
    if (referer === "http://localhost:1111/scissor/signup")
        return next(); // once bitten, twice shy! :)
    if (!jwtToken)
        return res.status(302).redirect("/scissor/login");
    (0, jsonwebtoken_1.verify)(jwtToken, JWT_SECRET_KEY, (err) => {
        if (err)
            return res.status(302).redirect("/scissor/login");
        next();
    });
}
exports.verifyJwtToken = verifyJwtToken;
function checkUser(req, res, next) {
    var _a;
    const jwtToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    if (!jwtToken) {
        res.locals.user = null;
        res.locals.isDashboard = null;
        return next();
    }
    (0, jsonwebtoken_1.verify)(jwtToken, JWT_SECRET_KEY, (err, decodedToken) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            res.locals.user = null;
            res.locals.isDashboard = null;
            return next();
        }
        if (typeof decodedToken === "object" &&
            decodedToken !== null &&
            "id" in decodedToken) {
            let user = yield user_model_1.UserModel.findOne({
                _id: decodedToken.id,
            });
            res.locals.user = user;
            res.locals.isDashboard = null;
            // NOTE: I intentionally did not place a 'return' keyword here. Because the next() method needs to run, for both truthy and falsy conditions.
        }
        next();
    }));
}
exports.checkUser = checkUser;
