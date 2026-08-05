import jwt from "jsonwebtoken";

export function signToken(
    payload: { sub: string; role: string },
    secret: string,
    expiry: string,
) {
    return jwt.sign(payload, secret, {
        expiresIn: expiry as jwt.SignOptions["expiresIn"],
    });
}
