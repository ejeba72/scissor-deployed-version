"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
function generateUserId(jwtToken, jwtSecret) {
    // if (!(jwtToken && jwtSecret)) return console.log(`User ID cannot be determined`);
    if (!(jwtToken && jwtSecret))
        return '';
    const decodedToken = (0, jsonwebtoken_1.verify)(jwtToken, jwtSecret);
    return decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id;
}
exports.generateUserId = generateUserId;
