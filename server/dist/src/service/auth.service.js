"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_repository_1 = require("../repository/user.repository");
const token_service_1 = require("./token.service");
const sha256Encrypt_1 = require("../utils/sha256Encrypt");
const lodash_1 = require("lodash");
class AuthService {
    constructor(userRepository = new user_repository_1.UserRepository(), tokenService = new token_service_1.TokenService()) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    signIn(email, password) {
        const user = this.userRepository.getByEmailOrThrow(email);
        if (user.password !== (0, sha256Encrypt_1.sha256Encrypt)(password, user.email)) {
            throw new Error("Password is incorrect");
        }
        const accessToken = this.tokenService.create({
            userId: user.id,
        }, 86164 // TODO: config
        );
        return {
            accessToken,
            user: (0, lodash_1.omit)(user, ['password']),
        };
    }
}
exports.AuthService = AuthService;
