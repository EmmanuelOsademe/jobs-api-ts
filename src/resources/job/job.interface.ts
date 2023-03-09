import {TypeOf} from 'zod';
import {createJobSchema, deleteJobSchema, getSingleJobSchema, updateJobSchema} from '@/resources/job/job.validation';

export type CreateJobInterface = TypeOf<typeof createJobSchema>['body'];
export type UpdateJobInterface = TypeOf<typeof updateJobSchema>;
export type GetSingleJobInterface = TypeOf<typeof getSingleJobSchema>['params']
export type DeleteJobInterface = TypeOf<typeof deleteJobSchema>['params']