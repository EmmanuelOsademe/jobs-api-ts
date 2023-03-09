import {object, string} from 'zod';

export const createJobSchema = object({
    body: object({
        company: string({
            required_error: "Company is required"
        }),
        location: string({
            required_error: "Location is required"
        }).array().nonempty(), 
        role: string({
            required_error: "Role is required"
        }),
        description: string({
            required_error: "Job description is required"
        }),
        expiresIn: string({
            required_error: "Job application end date required"
        }),
        category: string({
            required_error: "Job category is required"
        })
    })
})

export const updateJobSchema = object({
    params: object({
        id: string()
    }),
    body: object({
        company: string().optional(),
        location: string().array().optional(), 
        role: string().optional(),
        description: string().optional(),
        expiresIn: string().optional(),
        category: string().optional()
    })
});

export const getSingleJobSchema = object({
    params: object({
        id: string()
    })
})

export const deleteJobSchema = object({
    params: object({
        id: string()
    })
})