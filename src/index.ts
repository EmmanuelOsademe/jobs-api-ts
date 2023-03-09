import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import UserController from '@/resources/user/user.controller';
import SessionController from '@/resources/session/session.controller';
import JobController from '@/resources/job/job.controller';
import ApplicationController from '@/resources/application/application.controller';

validateEnv();

const app = new App([new UserController(), new SessionController(), new JobController(), new ApplicationController()], Number(process.env.PORT))

app.listen();