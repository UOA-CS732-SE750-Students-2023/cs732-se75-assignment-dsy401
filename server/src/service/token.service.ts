import { JwtPayload, sign, verify } from 'jsonwebtoken';

export class TokenService {
    // token secret
    private readonly tokenSecret = 'asdnasdhadlhasld'

    // create a token
    public create<T>(data: T, ttl: number): string {
        const exp = Math.floor(Date.now() / 1000) + ttl;

        return sign(
            {
                exp,
                data: JSON.stringify(data),
            },
            this.tokenSecret
        );
    }

    //verify a token
    public verify<T>(token: string): T {
        try {
            const {data} = verify(token, this.tokenSecret) as JwtPayload

            return JSON.parse(data) as T
        } catch (_) {
            throw new Error("Token is invalid")
        }
    }
}