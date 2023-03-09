import {Request, Response, NextFunction} from 'express';
import HttpException from '@/utils/exceptions/http.exception';
import { StatusCodes } from 'http-status-codes';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) =>{
    const user = res.locals.user;
    if(user){
        next()
    }else{
        next(new HttpException(StatusCodes.UNAUTHORIZED, "You are currenty logged out"))
    }
}

export default isLoggedIn;