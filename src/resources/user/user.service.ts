import UserModel from "@/resources/user/user.model";
import {CreateUserInterface, ForgotPasswordInterface, VerifyUserInterface} from "@/resources/user/user.interface";
import sendEmail from "@/utils/mailer";
import log from "@/utils/logger";
import {nanoid} from 'nanoid';

class UserService {
    private user = UserModel;

    public async register(userInput: CreateUserInterface): Promise<string | Error> {
        try {
            const user = await this.user.create(userInput);
            await sendEmail({
                from: "emmyjobs@gmail.com",
                to: user.email,
                subject: "Please verify your account",
                text: `Verification code: ${user.verificationCode}, Id: ${user._id}`
            })
            return "User successfully created"
        } catch (e: any) {
            console.log(e.message);
            if(e.code === 11000){
                throw new Error("Account already exist");
            }else{
                throw new Error(e.message);
            }
        }
    }

    public async verifyUser(verificationData: VerifyUserInterface): Promise<string | Error> {
        try {
            const {id, verificationCode} = verificationData;
            const user = await this.user.findById({_id: id});
            if(!user){
                throw new Error("User not found");
            }

            if(user.verified){
                return "User already verified";
            }

            if(user.verificationCode === verificationCode){
                user.verified = true;
                await user.save();
                return "User successfully verified";
            }else{
                throw new Error("Could not verify User");
            }
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async forgotPassword(email: String): Promise<string | Error>{
        try {
            const user = await this.user.findOne({email});
            if(!user){
                log.debug(`User with email: ${email} does not exist`);
                throw new Error('Account does not exist')
            }

            if(!user.verified){
                throw new Error(`Account not verified`);
            }

            const passwordResetCode = nanoid();
            user.passwordResetCode = passwordResetCode;
            await user.save();

            await sendEmail({
                from: 'emmyjobs@gmail.com',
                to: user.email,
                subject: "Reset your password",
                text: `Password reset code: ${passwordResetCode}, ID: ${user._id}`
            })

            log.debug(`Password reset email sent to ${email}`);
            return "Please check your email to rest your password";
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async resetPassword(id: string, password: string, passwordResetCode: string): Promise<string | Error>{
        try {
            const user = await this.user.findById({_id: id});

            if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode){
                throw new Error("Could not reset user password");
            }

            user.passwordResetCode = null;
            user.password = password;

            await user.save();

            return `Successfully updated user password`;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

export default UserService;