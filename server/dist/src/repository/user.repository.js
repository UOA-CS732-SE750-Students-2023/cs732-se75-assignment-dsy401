"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sha256Encrypt_1 = require("../utils/sha256Encrypt");
const users = [
    {
        id: '4e6cb539-26d3-4878-ac17-9aba43bb278f',
        name: 'Shunyuan Deng',
        email: 'sden406@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('123456', 'sden406@aucklanduni.ac.nz')
    },
    {
        id: 'c900b339-3f21-4adc-961f-303f2093943e',
        name: 'Marker',
        email: 'marker@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('111111', 'marker@aucklanduni.ac.nz')
    },
    {
        id: '057fc87c-1275-4753-af57-fec59d10522e',
        name: 'Reviewer',
        email: 'reviewer@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('654321', 'reviewer@aucklanduni.ac.nz')
    }
];
class UserRepository {
    getByEmail(email) {
        var _a;
        return (_a = users.find((user) => user.email === email)) !== null && _a !== void 0 ? _a : null;
    }
    getByEmailOrThrow(email) {
        const user = this.getByEmail(email);
        if (!user) {
            throw new Error("User is not found");
        }
        return user;
    }
}
exports.UserRepository = UserRepository;
