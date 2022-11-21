import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface UserInfo {
  id: number;
  name: string;
  hashed_password: string;
  email: string;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
      return res.status(403).send('A token is required for authentication of the form \"Bearer ******\"');
  }
  try {
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN || "");
      if (typeof decodedToken === "object") {
        req.userId = decodedToken.userId; // This allows our endpoints to determine the username/userid
      }
  } catch (err) {
      return res.status(401).send('Invalid Token');
  }
  next();
};

export const handleOptionalToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN || "");
      if (typeof decodedToken === "object") {
        req.userId = decodedToken.userId; // This allows our endpoints to determine the username/userid
      }
    } catch (err) {}
  }
  next();
}

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    { userId: userId },
    process.env.SECRET_TOKEN || "",
    {
      expiresIn: '1h',
    }
  );
}