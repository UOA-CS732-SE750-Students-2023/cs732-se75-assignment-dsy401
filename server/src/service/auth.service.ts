import {UserRepository} from "../repository/user.repository";
import {TokenService} from "./token.service";
import {sha256Encrypt} from "../utils/sha256Encrypt";
import {omit} from "lodash";

export class AuthService {
    constructor(private readonly userRepository: UserRepository = new UserRepository(),
                private readonly tokenService: TokenService = new TokenService()
                ) {
    }


    public signIn(email: string, password: string) {
        const user = this.userRepository.getByEmailOrThrow(email)


        if (user.password !== sha256Encrypt(password, user.email)) {
            throw new Error("Password is incorrect")
        }

        const accessToken = this.tokenService.create({
            userId: user.id,
        },
            86164 // TODO: config
            )

        return {
            accessToken,
            user: omit(user, ['password']),
        }
    }
}