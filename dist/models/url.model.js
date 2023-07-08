"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModel = void 0;
const mongoose_1 = require("mongoose");
;
const UrlSchema = new mongoose_1.Schema({
    longUrl: 'string',
    shortUrl: 'string',
    qrcodeFileLocation: 'string',
    userId: {
        type: 'string',
        required: true,
    },
    qrcodeRequested: 'boolean',
    clicks: {
        type: 'number',
        default: 0,
    },
    clickDetails: [
        {
            timestamp: { type: Date, default: Date.now },
            referrer: 'string',
            userAgent: 'string',
        },
    ],
}, { timestamps: true });
const UrlModel = (0, mongoose_1.model)('Url', UrlSchema);
exports.UrlModel = UrlModel;
