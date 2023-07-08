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
exports.qrcodeResMsg = exports.qrGenerator = void 0;
const qrcode_1 = require("qrcode");
function qrGenerator(filePath, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (0, qrcode_1.toFile)(filePath, data);
        }
        catch (err) {
            if (err instanceof Error)
                return console.log(err.message);
            console.log(err);
        }
    });
}
exports.qrGenerator = qrGenerator;
function qrcodeResMsg(qrcodeRequested) {
    if (qrcodeRequested)
        return 'QRCode was generated';
    return 'QRCode was not requested for';
}
exports.qrcodeResMsg = qrcodeResMsg;
