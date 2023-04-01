"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const sha256Encrypt_1 = require("../utils/sha256Encrypt");
const users = [
    {
        id: 'fca03c0e-ea8e-4775-aa02-f5a3d56d35e7',
        name: 'Shunyuan Deng',
        email: 'sden406@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('123456', 'sden406@aucklanduni.ac.nz')
    },
    {
        id: 'b5eb0ec5-d8b5-466a-bc10-f6829b48461f',
        name: 'Marker',
        email: 'marker@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('111111', 'marker@aucklanduni.ac.nz')
    },
    {
        id: 'bfc8e1a6-9687-44d9-9771-1b4fcfebfe6d',
        name: 'Reviewer',
        email: 'reviewer@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('654321', 'reviewer@aucklanduni.ac.nz')
    },
    {
        id: 'bfc8e1a6-9687-44d9-9771-1b4fcfebfe6da',
        name: 'Guest',
        email: 'guest@aucklanduni.ac.nz',
        password: (0, sha256Encrypt_1.sha256Encrypt)('333333', 'guest@aucklanduni.ac.nz')
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
    getById(id) {
        var _a;
        return (_a = users.find((user) => user.id === id)) !== null && _a !== void 0 ? _a : null;
    }
    getByIdOrThrow(id) {
        const user = this.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    listAllUsers() {
        return users;
    }
}
exports.UserRepository = UserRepository;
