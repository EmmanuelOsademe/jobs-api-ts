import jwt from 'jsonwebtoken';
import {DocumentType} from '@typegoose/typegoose';
import {privateFields, User} from "@/resources/user/user.model";
import {omit} from 'lodash';
import config from "config";

export function signJwt(
    object: Object,
    keyName: string,//'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
    options?: jwt.SignOptions | undefined
){
   
    //const signingKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    const signingKey = Buffer.from(keyName, "base64").toString("ascii");
    
    return jwt.sign(object, signingKey, {...(options && options), algorithm: "RS256"});
}

export function verifyJwt<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'): T | null {
    const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    try {
        const decode = jwt.verify(token, publicKey) as T;
        return decode;
    } catch (e) {
        return null;
    }
};

export function signAccessToken(user: DocumentType<User>){
    const payload = omit(user.toJSON(), privateFields);
    console.log(payload);
    
    /*const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
        expiresIn: "10m"
    })*/
    const accessToken = signJwt(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY as string, {
        expiresIn: "10m"
    })
    console.log(accessToken);

    return accessToken;
}

export function signRefreshToken(sessionId: string){
    const payload = {session: sessionId};

    /*const refreshToken = signJwt(payload, 'refreshTokenPrivateKey', {
        expiresIn: "1y"
    });*/
    const refreshToken = signJwt(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY as string, {expiresIn: '1y'});

    return refreshToken;
}