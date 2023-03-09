import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validateResource from '@/middlewares/validateResource.middleware';
import { StatusCodes } from 'http-status-codes';
import {CreateApplicationInterface, GetAllApplicationsInterface, GetApplicationByIdInterface, GetApplicationsByJobInterface, GetApplicationsByUserInterface} from '@/resources/application/application.interface';
import { createApplicationSchema, getAllApplicationsSchema, getApplicationByIdSchema, getApplicationsByJobSchema, getApplicationsByUserSchema } from '@/resources/application/application.validation';
import log from '@/utils/logger';
import isLoggedIn from '@/middlewares/isLoggedIn.middleware';
import ApplicationService from '@/resources/application/application.service';

class ApplicationController implements Controller {
    public path = '/applications';
    public router = Router();
    private ApplicationService = new ApplicationService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/:userId`,
            [isLoggedIn, validateResource(createApplicationSchema)],
            this.create
        )

        this.router.get(
            `${this.path}/user/:userId`,
            [isLoggedIn, validateResource(getApplicationsByUserSchema)],
            this.getApplicationsByUser
        )

        this.router.get(
            `${this.path}/job/:job`,
            [isLoggedIn, validateResource(getApplicationsByJobSchema)],
            this.getApplicationsByJob
        )

        this.router.get(
            `${this.path}/id/:id`,
            [isLoggedIn, validateResource(getApplicationByIdSchema)],
            this.getApplicationById
        )

        this.router.get(
            `${this.path}`,
            [isLoggedIn, validateResource(getAllApplicationsSchema)],
            this.getAllApplications
        )
    }

    private create = async (req: Request<CreateApplicationInterface['params'], {}, CreateApplicationInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {userId} = req.params;
        const {jobId} = req.body;
    
        try {
            const message = await this.ApplicationService.create(userId, jobId)
            res.status(StatusCodes.CREATED).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getApplicationsByUser = async (req: Request<GetApplicationsByUserInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {userId} = req.params;

        try {
            const applications = await this.ApplicationService.getApplicationsByUser(userId);
            res.status(StatusCodes.OK).json(applications);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getApplicationsByJob = async (req: Request<GetApplicationsByJobInterface>, res: Response, next: NextFunction): Promise<Response | void> =>{
        const {job} = req.params;
        try {
            const applications = await this.ApplicationService.getApplicationsByJob(job);
            res.status(StatusCodes.OK).json(applications);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    } 

    private getApplicationById = async (req: Request<GetApplicationByIdInterface>, res: Response, next: NextFunction): Promise<Response | void> =>{
        const {id} = req.params;
        console.log(id)
        try {
            const application = await this.ApplicationService.getApplicationById(id);
            res.status(StatusCodes.OK).json(application);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getAllApplications = async (req: Request<GetAllApplicationsInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const queryOptions = req.query;
        console.log(queryOptions);
        try {
            const applications = await this.ApplicationService.getAllApplications(queryOptions);
            res.status(StatusCodes.OK).json(applications);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }
}

export default ApplicationController;