import ApplicationModel, {Application} from '@/resources/application/application.model';
import sendEmail from '@/utils/mailer';
import { Document } from 'mongoose';
import JobModel from '../job/job.model';
import UserModel from '../user/user.model';
import { GetAllApplicationsInterface } from './application.interface';

class ApplicationService {
    private application = ApplicationModel;

    public async create(userId: string, jobId: string): Promise<string | Error> {
        try {
            if(!userId || !jobId){
                throw new Error('Missing required inputs');
            }
            const user = await UserModel.findById({_id: userId});
            if(!user){
                throw new Error('User does not exist');
            }

            const job = await JobModel.findById({_id: jobId});
            if(!job){
                throw new Error('Job does not exist');
            }

            const alreadyApplied = await this.application.findOne({user: userId}) as Document<Application>;
            
            if(alreadyApplied && (String(alreadyApplied.toJSON().job) === jobId)){
                throw new Error('You have already applied for this job');
            }

            await this.application.create({user: userId, job: jobId, status: "pending"});
            
            const text = `Dear ${user.firstName}, \n \nYour application for the position of ${job.role} has been received. \nWe will review you application and revert back to you in the coming weeks`;
            
            await sendEmail({
                from: "emmyjobs@gmail.com",
                to: user.email,
                subject: "Job Application Confirmation",
                text: text
            })

            return 'Application successfully created';
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getApplicationsByUser(userId: string): Promise<Document<Application>[] | Error>{
        try {
            const applications = await this.application.find({user: userId});
            return applications;
        } catch (e: any) {
            if(e.name === "CastError"){
                throw new Error("User ID required");
            }else{
                throw new Error(e.message);
            }
        }
    }

    public async getApplicationsByJob(job: string): Promise<Document<Application>[] | Error> {
        try {
            const applications = await this.application.find({job: job});
            return applications;
        } catch (e: any) {
            if(e.name === "CastError"){
                throw new Error("Job ID required");
            }else{
                throw new Error(e.message);
            }
        }
    }

    public async getApplicationById(id: string): Promise<Document<Application> | Error>{
        try {
            const application = await this.application.findById({_id: id}) as Document<Application>
            return application
        } catch (e: any) {
            if(e.name === "CastError"){
                throw new Error("Job ID required");
            }else{
                throw new Error(e.message);
            }
        }
    }

    public async getAllApplications(searchOptions: GetAllApplicationsInterface): Promise<Document<Application>[] | Error>{
        const {job, user} = searchOptions;
        const searchObject = {} as GetAllApplicationsInterface;
        if(job){
            searchObject.job = job;
        }

        if(user){
            searchObject.user = user;
        }

        try {
            const applications = await this.application.find(searchObject);
            return applications;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }
}

export default ApplicationService;