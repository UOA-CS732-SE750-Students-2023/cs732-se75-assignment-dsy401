"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class TokenService {
    constructor() {
        this.tokenSecret = 'asdnasdhadlhasld'; // TODO: config
    }
    create(data, ttl) {
        const exp = Math.floor(Date.now() / 1000) + ttl;
        return (0, jsonwebtoken_1.sign)({
            exp,
            data: JSON.stringify(data),
        }, this.tokenSecret);
    }
    verify(token) {
        try {
            const { data } = (0, jsonwebtoken_1.verify)(token, this.tokenSecret);
            return JSON.parse(data);
        }
        catch (_) {
            throw new Error("Token is invalid");
        }
    }
}
exports.TokenService = TokenService;
