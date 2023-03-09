import UserModel from '@/resources/user/user.model';
import SessionModel from '@/resources/session/session.model';
import { CreateSessionInterface } from '@/resources/session/session.interface';
import {createAccessToken, createRefreshToken} from '@/utils/token';
import {verifyRefreshToken} from '@/utils/token';
import log from '@/utils/logger';

class SessionService {
    private user = UserModel;
    private session = SessionModel;

    public async createSession(sessionInput: CreateSessionInterface): Promise<Object | void> {
        try {
            const {email, password} = sessionInput;

            const user = await this.user.findOne({email});

            if(!user){
                throw new Error('Invalid email or password');
            }

            if(!user.verified){
                throw new Error('Invalid email or password')
            };
            
            const isValid = await user.validatePassword(password);
            
            if(!isValid){
                throw new Error('Invalid email or password');
            }

            const oldSession = await this.session.findOne({user: user._id});
            if(oldSession){
                await oldSession.remove();
            }

            const session = await this.session.create({user: user._id});

            //Sign accesse token
            const accessToken = createAccessToken(user);

            // Sign refresh token
            const refreshToken = createRefreshToken(session._id)

            return {accessToken, refreshToken};
        } catch (e: any) {
            throw new Error("Invalid Email or Password");
        }
    }

    public async refreshSession(refreshToken: string): Promise<string | void>{
        try {
            const decoded = verifyRefreshToken<{session: string}>(refreshToken)

            if(!decoded){
                throw new Error("Could not refresh access token")
            }

            const session = await this.session.findById({_id: decoded.session});

            if(!session || !session.valid){
                throw new Error("Could not refresh access token")
            }

            const user = await this.user.findById({_id: session.user});

            if(!user){
                throw new Error("Could not refresh access token");
            }

            const accessToken = createAccessToken(user);

            return accessToken;
        } catch (e: any) {
            log.error(e.message);
            throw new Error("Could not refresh access token");
        }
    }

    public async endSession(userId: string): Promise<string | Error> {
        try {
            const session = await this.session.findOne({user: userId});
            if(session){
                await session.remove();
            }

            return `You have been successfully logged out`;
        } catch (e: any) {
            throw new Error(e.message)
        }
    }
}

export default SessionService;