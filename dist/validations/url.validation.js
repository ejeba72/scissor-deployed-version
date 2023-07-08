"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZUrlSchema = void 0;
const zod_1 = require("zod");
const ZUrlSchema = zod_1.z.object({
    longUrl: zod_1.z.string({ required_error: `Please enter the url you wish to shorten` }),
    qrcodeRequested: zod_1.z.boolean(),
    customUrl: zod_1.z.string().optional(),
    clicks: zod_1.z.number().default(0).optional(),
    clickDetails: zod_1.z.array(zod_1.z.object({
        timestamp: zod_1.z.date().default(() => new Date()).optional(),
        referrer: zod_1.z.string().optional(),
        userAgent: zod_1.z.string().optional(),
    })).optional(),
});
exports.ZUrlSchema = ZUrlSchema;
