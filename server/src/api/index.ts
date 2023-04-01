import {Router, Express} from "express";
import {AuthService} from "../service/auth.service";

export const registerApis = (app: Express): void => {
    const router = Router();

    const authService = new AuthService()

    router.post('/sign-in', (req, res) => {
        const {email, password} = req.body

        try {
            const user = authService.signIn(email, password)

            return res.status(201).json(user)
        } catch (_) {
            return res.status(400).json({
                errorMessage: 'Cannot sign in'
            })
        }
    })



    app.use('/api', router)
}