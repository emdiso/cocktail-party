import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// import psqlPool from '../utils/psqlConnection';
import { verifyToken } from '../utils/authUtils';


const cocktailApiRouter = express.Router();
dotenv.config();


cocktailApiRouter.get('/', verifyToken, (req: Request, res: Response) => {
    
    res.send()
});

export default cocktailApiRouter;