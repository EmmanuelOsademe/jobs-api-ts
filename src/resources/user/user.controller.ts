import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validateResource from '@/middlewares/validateResource.middleware';
import {createUserSchema, verifyUserSchema, forgotPasswordSchema, resetPasswordSchema} from "@/resources/user/user.validation";
import UserService from "@/resources/user/user.service";
import {StatusCodes} from 'http-status-codes';
import { CreateUserInterface, VerifyUserInterface, ForgotPasswordInterface, ResetPasswordInterface } from './user.interface';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void{
        this.router.post(
            `${this.path}/register`,
            validateResource(createUserSchema),
            this.register
        );

        this.router.get(
            `${this.path}/verify/:id/:verificationCode`,
            validateResource(verifyUserSchema),
            this.verifyUser
        )

        this.router.post(
            `${this.path}/forgotPassword`,
            validateResource(forgotPasswordSchema),
            this.forgotPassword
        )

        this.router.post(
            `${this.path}/resetPassword/:id/:passwordResetCode`,
            validateResource(resetPasswordSchema),
            this.resetPassword
        )

        this.router.get(
            `${this.path}/me`,
            this.getCurrentUser
        )
        
    }

    private register = async (req: Request<{}, {}, CreateUserInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const userInput = req.body;
        try {
            const message = await this.UserService.register(userInput)
            res.status(StatusCodes.CREATED).send(message);
        } catch (e: any) {
            console.log(e.message);
            if(e.code === 11000){
                next(new HttpException(StatusCodes.CONFLICT, e.message))
            }else{
                next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
            }
        }
    }

    private verifyUser = async (req: Request<VerifyUserInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const verificationData = req.params;
        try {
            const message = await this.UserService.verifyUser(verificationData);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            console.log(e);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }

    private forgotPassword = async (req: Request<{}, {}, ForgotPasswordInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {email} = req.body;
        try {
            const message = await this.UserService.forgotPassword(email);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private resetPassword = async (req: Request<ResetPasswordInterface['params'], {}, ResetPasswordInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> =>{
        const {id, passwordResetCode} = req.params;
        const {password} = req.body;

        try {
            const message = await this.UserService.resetPassword(id, password, passwordResetCode);
            console.log(message);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const user = res.locals.user;

        if(user){
            res.status(StatusCodes.OK).json(user);
        }else{
            next(new HttpException(StatusCodes.FORBIDDEN, 'You are currently logged out'));
        }
    } 
}

export default UserController;