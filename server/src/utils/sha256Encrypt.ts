import * as crypto from 'crypto';

export const generatePwdSalt = (): string => {
    return crypto.randomBytes(16).toString('base64');
};

// slow sha256Encrypt (Slow Hash Algorithm)
export const sha256Encrypt = (value: string, salt: string): string => {
    let secrets = value;

    for (let i = 0; i < 50; i++) {
        secrets = crypto
            .createHash('sha256')
            .update(secrets + salt, 'binary')
            .digest('base64');
    }

    return secrets;
};
