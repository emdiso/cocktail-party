import express, { Express, Response } from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter';
import cocktailApiRouter from './routes/cocktailApiRouter';
import imageRouter from './routes/imageRouter';
import { verifyToken, AuthenticatedRequest } from './utils/authUtils';


dotenv.config();
const PORT = process.env.PORT || 3001;
const sysEnv = process.env.NODE_ENV || 'development';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


if (sysEnv === 'development') {
  app.get("/healthcheck", verifyToken, (req: AuthenticatedRequest, res: Response) => {
    res.sendStatus(200);
  });
}

app.use('/auth', authRouter);
app.use('/cocktail_api', cocktailApiRouter);
app.use('/image', imageRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});