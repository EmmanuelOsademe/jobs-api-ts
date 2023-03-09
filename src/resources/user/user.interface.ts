import {TypeOf} from "zod";
import { createUserSchema, verifyUserSchema, forgotPasswordSchema, resetPasswordSchema } from "@/resources/user/user.validation";

export type CreateUserInterface  = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInterface = TypeOf<typeof verifyUserSchema>['params'];
export type ForgotPasswordInterface = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInterface = TypeOf<typeof resetPasswordSchema>