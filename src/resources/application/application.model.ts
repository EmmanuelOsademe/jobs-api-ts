import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import {User} from '@/resources/user/user.model';
import {Job} from '@/resources/job/job.model';


export class Application {
    @prop({ref: () => User})
    user: Ref<User>

    @prop({ref: () => Job})
    job: Ref<Job>

    @prop({enum: ['pending', 'declined', 'interviewed', 'approved']})
    status: string
}

const ApplicationModel = getModelForClass(Application, {
    schemaOptions: {
        timestamps: true
    }
});

export default ApplicationModel;