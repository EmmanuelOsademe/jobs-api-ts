import {cleanEnv, str, port} from 'envalid';

export default function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production']
        }),
        MONGO_URI: str(),
        PORT: port({default: 5000}),
        LOG_LEVEL: str(),
        ACCESS_TOKEN_SECRET_KEY: str(),
        REFRESH_TOKEN_SECRET_KEY: str()
    });
};