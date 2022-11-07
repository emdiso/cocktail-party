import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
        return res.status(403).send('A token is required for authentication of the form \"Bearer ******\"');
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN || "");
        req.push(decodedToken); // This allows our endpoints to determine the username/userid
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

export const generateAccessToken = (username: string) => {
  return jwt.sign(
    { username: username }, // TODO: replace with userid from DB instead
    process.env.SECRET_TOKEN || "",
    {
      expiresIn: '1h',
    }
  );
}