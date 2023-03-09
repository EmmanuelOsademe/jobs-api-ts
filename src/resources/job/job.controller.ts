import {Router, Request, Response, NextFunction} from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validateResource from '@/middlewares/validateResource.middleware';
import { StatusCodes } from 'http-status-codes';
import {CreateJobInterface, UpdateJobInterface, GetSingleJobInterface, DeleteJobInterface} from '@/resources/job/job.interface';
import {createJobSchema, updateJobSchema, getSingleJobSchema, deleteJobSchema} from '@/resources/job/job.validation';
import log from '@/utils/logger';
import JobService from '@/resources/job/job.service';
import isLoggedIn from '@/middlewares/isLoggedIn.middleware';

class JobController implements Controller {
    public path='/jobs';
    public router = Router();
    private JobService = new JobService();

    constructor(){
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            [isLoggedIn, validateResource(createJobSchema)],
            this.create
        );

        this.router.put(
            `${this.path}/:id`,
            [isLoggedIn, validateResource(updateJobSchema)],
            this.update
        )

        this.router.get(
            `${this.path}/single/:id`,
            [isLoggedIn, validateResource(getSingleJobSchema)],
            this.getSingleJob
        )

        this.router.get(
            `${this.path}`,
            isLoggedIn,
            this.getJobs
        )

        this.router.delete(
            `${this.path}/:id`,
            [isLoggedIn, validateResource(deleteJobSchema)],
            this.deleteJob
        )
    }

    private create = async(req: Request<{}, {}, CreateJobInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        const jobInput = req.body;
        
        try {
            const message = await this.JobService.create(jobInput);
            res.status(StatusCodes.CREATED).send(message);
        } catch (e: any) {
            log.error(e.message)
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private update = async (req: Request<UpdateJobInterface['params'], {}, UpdateJobInterface['body']>, res: Response, next: NextFunction): Promise<Response | void> => {
        const {id} = req.params;
        const updateData = req.body;

        try {
            const message = await this.JobService.update(id, updateData);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            log.error(e.message);
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message))
        }
    }

    private getSingleJob = async (req: Request<GetSingleJobInterface>, res: Response, next: NextFunction): Promise<Response | void> =>{
        const {id} = req.params;

        try {
            const job = await this.JobService.getSingleJob(id);
            res.status(StatusCodes.OK).json(job);
        } catch (e: any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }

    private getJobs = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const products = await this.JobService.getJobs();
            res.status(StatusCodes.OK).json(products);
        } catch (e: any) {
            next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, e.message))
        }
    }

    private deleteJob = async (req: Request<DeleteJobInterface>, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const {id} = req.params;
            const message = await this.JobService.deleteJob(id);
            res.status(StatusCodes.OK).send(message);
        } catch (e: any) {
            next(new HttpException(StatusCodes.BAD_REQUEST, e.message));
        }
    }
}

export default JobController;