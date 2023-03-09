import express, {Application} from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Controller from "@/utils/interfaces/controller.interface";
import errorMiddleware from "@/middlewares/error.middleware";
import deserialiseUser from '@/middlewares/deserialiseUser.middleware';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number){
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandler();
    }

    private initialiseDatabaseConnection(): void {
        const {MONGO_URI} = process.env;
        if(MONGO_URI){
            mongoose.set('strictQuery', false)
            mongoose.connect(MONGO_URI, {autoIndex: true})
        }
    }

    private initialiseMiddleware(): void{
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({extended: false}));
        this.express.use(compression());
        this.express.use(deserialiseUser);
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) =>{
            this.express.use('/api/v1', controller.router);
        })
    }

    private initialiseErrorHandler(): void{
        this.express.use(errorMiddleware);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App is listening on localhost:${this.port}`);
        })
    }
}

export default App;