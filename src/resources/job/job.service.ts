import JobModel, {Job} from '@/resources/job/job.model';
import {CreateJobInterface, GetSingleJobInterface, UpdateJobInterface} from '@/resources/job/job.interface';
import log from '@/utils/logger';
import { Document } from 'mongoose';


class JobService {
    private job = JobModel;

    public async create(jobInput: CreateJobInterface): Promise<string | Error>{
        try {
            await this.job.create(jobInput);
            return "Job successfully created";
        } catch (e: any) {
            log.error(e.message);
            throw new Error('Error creating job');
        }
    }

    public async update(id: string, updateData: UpdateJobInterface['body']): Promise<string | Error>{
        try {
            if(!id){
                throw new Error('Job ID is required');
            }
            const job = await this.job.findById({_id: id});
            if(!job){
                throw new Error('Job does not exist');
            }

            if(Object.keys(updateData).length === 0){
                throw new Error('No field(s) for update')
            }

            await this.job.findOneAndUpdate({_id: id}, updateData, {
                new: true
            });

            return "Product updated successfully";
        } catch (e: any) {
            throw new Error(e.message)
        }
    }

    public async getSingleJob(id: string): Promise<Document<Job> | Error> {
        try {
            const job = await this.job.findById({_id: id}) as Document<Job>;
            return job;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async getJobs(): Promise<Document<Job>[] | Error> {
        try {
            const jobs = await this.job.find({})
            return jobs;
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async deleteJob(id: string): Promise<string | Error> {
        try {
            const job = await this.job.findById({_id: id});
            if(!job){
                throw new Error("Job not found");
            }

            await job.remove();
            return "Job successfully removed";
        } catch (e: any) {
            throw new Error(e.message)
        }
    }
}

export default JobService;