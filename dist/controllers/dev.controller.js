"use strict";
// This controller is for development purpose only
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
exports.getUserReq = exports.postReq = exports.getReq = void 0;
const user_model_1 = require("../models/user.model");
function getReq(req, res) {
    try {
        console.log({ "successfulGetReq": "A Get request was made to the '/dev' route." });
        res.status(200).send({ getReqPayload: "Your test Get request is successful!" });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
        else {
            console.log(err);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
    }
}
exports.getReq = getReq;
function postReq(req, res) {
    try {
        const payload = req.body;
        console.log({ payload });
        res.status(201).send({ payload });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            res.status(500).send({ errMsg: 'Interrnal Server Error' });
        }
        else {
            console.log(err);
            res.status(500).send({ errMsg: 'Internal Server Error' });
        }
    }
}
exports.postReq = postReq;
function getUserReq(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const email = 'caleb';
            `
    "_id": "6484c6d62b5101e4038ab03d",
    "_id": "6484c6d62b5101e4038ab03d",
    "_id": "6484c6d62b5101e4038ab03d",
    `;
            const { email } = req.params;
            console.log({ reqParams: req.params });
            console.log({ email });
            const user = (yield user_model_1.UserModel.find({ email }))[0];
            // const user = users[0];
            // const user = await UserModel.find();
            // const user = await UserModel.findOne({ email });
            console.log(user);
            res.status(200).json(user);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
            console.log(err);
            res.status(500).json(err);
        }
    });
}
exports.getUserReq = getUserReq;
