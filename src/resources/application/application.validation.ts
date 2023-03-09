import {object, string} from 'zod';

export const createApplicationSchema = object({
    params: object({
        userId: string({
            required_error: "User ID is required"
        })
    }),
    body: object({
        jobId: string({
            required_error: "Job ID is required"
        })
    })
})

export const getApplicationsByUserSchema = object({
    params: object({
        userId: string({
            required_error: "User ID is required"
        })
    })
})

export const getApplicationsByJobSchema = object({
    params: object({
        job: string({
            required_error: "Job ID is required"
        })
    })
})

export const getApplicationByIdSchema = object({
    params: object({
        id: string({
            required_error: "Application ID is required"
        })
    })
})

export const getAllApplicationsSchema = object({
    params: object({
        job: string().optional(),
        user: string().optional()
    })
})