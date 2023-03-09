import {object, string} from 'zod';

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "First name is required"
        }),
        lastName: string({
            required_error: "Last name is required"
        }),
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be a minimum of 8 chars"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email")
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
});

export const verifyUserSchema = object({
    params: object({
        id: string(),
        verificationCode: string()
    })
})

export const forgotPasswordSchema = object({
    body: object({
        email: string()
    })
})

export const resetPasswordSchema = object({
    params: object({
        id: string(),
        passwordResetCode: string()
    }),
    body: object({
        password: string({
            required_error: "Password is required"
        }).min(8, "Password must be a minimum of 8 characters"),
        passwordConfirmation: string({
            required_error: "Password confirmation is required"
        })
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]
    })
})