import { getModelForClass, prop, Severity } from "@typegoose/typegoose";

export class Job {
    @prop({required: true})
    company: string

    @prop({ type: String, required: true})
    location: Array<string>//mongoose.Types.Array<string>

    @prop({required: true, unique: true})
    role: string

    @prop({required: true})
    description: string

    @prop({lowercase: true})
    expiresIn: string

    @prop({enum: ['tech', 'finance', 'hospitality', 'general'], default: 'general'})
    category: string

}

const JobModel = getModelForClass(Job, {
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})

export default JobModel;