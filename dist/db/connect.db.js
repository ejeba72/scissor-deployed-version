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
exports.mongodb = void 0;
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
(0, dotenv_1.config)();
// const DB_URI: string | undefined = process.env.DB_URI;
if (!process.env.DB_URI) {
    throw new Error('MongoDB URI not found in environment variables');
}
const DB_URI = process.env.DB_URI;
function mongodb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_1.connect)(DB_URI);
            console.log(`MongoDB is connected`);
        }
        catch (err) {
            if (err instanceof Error) {
                console.log(err.message);
            }
            else {
                console.log(err);
            }
        }
    });
}
exports.mongodb = mongodb;
