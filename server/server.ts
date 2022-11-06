import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRouter, { verifyToken } from './routes/authRoute';


dotenv.config();
const PORT = process.env.PORT || 3001;
const sysEnv = process.env.NODE_ENV || 'development';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


if (sysEnv === 'development') {
  app.get("/healthcheck", verifyToken, async (req: Request, res: Response) => {
    res.send();
  });
}

app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});