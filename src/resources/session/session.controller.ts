import {Router, Request, Response, NextFunction} from "express";
import Controller from "@/utils/interfaces/controller.interface";
import validateResource from "@/middlewares/validateResource.middleware";
import HttpException from "@/utils/exceptions/http.exception";
import { createSessionSchema } from "@/resources/session/session.validation";
import SessionService from '@/resources/session/session.service';
import { CreateSessionInterface } from "./session.interface";
import { StatusCodes } from "http-status-codes";
import {get} from 'lodash'
import log from "@/utils/logger";


class SessionController implements Controller {
    public path = '/sessions';
    public router = Router();
    private SessionService = new SessionService()

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            validateResource(createSessionSchema),
            this.createSession
        );

        this.router.get(
            `${this.path}/refresh`,
            this.refreshSession
        )

        this.router.delete(
            `${this.path}`,
            this.endSession
        )
    }

    private createSession = async (req: Request<{}, {}, CreateSessionInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const sessionInput = req.body;

        try {
            const tokens = await this.SessionService.createSession(sessionInput);
            res.status(StatusCodes.OK).json(tokens);
        } catch (e:any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }

    private refreshSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const refreshToken = get(req, "headers.x-refresh") as string;

        try {
            const newAccessToken = await this.SessionService.refreshSession(refreshToken);
            res.status(StatusCodes.OK).json({accessToken: newAccessToken})
        } catch (e: any) {
            next(new HttpException(StatusCodes.UNAUTHORIZED, e.message))
        }
    }

    private endSession = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const userId = res.locals.user._id;
        try {
            const message = await this.SessionService.endSession(userId);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.UNAUTHORIZED, e.message));
        }
    }
}

export default SessionController;