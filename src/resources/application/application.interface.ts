import { TypeOf } from 'zod';
import {    
        createApplicationSchema, 
        getApplicationsByUserSchema,
        getApplicationsByJobSchema,
        getApplicationByIdSchema, 
        getAllApplicationsSchema
    } from '@/resources/application/application.validation';

export type CreateApplicationInterface = TypeOf<typeof createApplicationSchema>
export type GetApplicationsByUserInterface = TypeOf<typeof getApplicationsByUserSchema>['params']
export type GetApplicationsByJobInterface = TypeOf<typeof getApplicationsByJobSchema>['params']
export type GetApplicationByIdInterface = TypeOf<typeof getApplicationByIdSchema>['params']
export type GetAllApplicationsInterface = TypeOf<typeof getAllApplicationsSchema>['params'];