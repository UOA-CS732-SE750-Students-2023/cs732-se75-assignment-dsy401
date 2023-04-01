"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Encrypt = exports.generatePwdSalt = void 0;
const crypto = __importStar(require("crypto"));
const generatePwdSalt = () => {
    return crypto.randomBytes(16).toString('base64');
};
exports.generatePwdSalt = generatePwdSalt;
// slow sha256Encrypt (Slow Hash Algorithm)
const sha256Encrypt = (value, salt) => {
    let secrets = value;
    for (let i = 0; i < 50; i++) {
        secrets = crypto
            .createHash('sha256')
            .update(secrets + salt, 'binary')
            .digest('base64');
    }
    return secrets;
};
exports.sha256Encrypt = sha256Encrypt;
