import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const router = express.Router();
dotenv.config();


// interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.status(403).send('A token is required for authentication of the form \"Bearer ******\"');
    }
    try {
        jwt.verify(token, process.env.SECRET_TOKEN || "");
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

export const generateAccessToken = (username: string) => {
  return jwt.sign(
    { username: username },
    process.env.SECRET_TOKEN || "",
    {
      expiresIn: '1h',
    }
  );
}

export default router;