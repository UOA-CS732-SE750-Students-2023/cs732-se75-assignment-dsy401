"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApis = void 0;
const express_1 = require("express");
const auth_service_1 = require("../service/auth.service");
const registerApis = (app) => {
    const router = (0, express_1.Router)();
    const authService = new auth_service_1.AuthService();
    router.post('/sign-in', (req, res) => {
        const { email, password } = req.body;
        try {
            const user = authService.signIn(email, password);
            return res.status(201).json(user);
        }
        catch (_) {
            return res.status(400).json({
                errorMessage: 'Cannot sign in'
            });
        }
    });
    app.use('/api', router);
};
exports.registerApis = registerApis;
