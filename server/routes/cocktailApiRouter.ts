import express, { Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
var cors = require('cors');
require('dotenv').config();

const cocktailApiRouter = express.Router();
cocktailApiRouter.use(cors());
cocktailApiRouter.use(express.json());

const api_key = process.env.COCKTAIL_API_KEY_DEV;
const api_url = process.env.COCKTAIL_API_MAIN_URL; 

cocktailApiRouter.get('/list_ingredients', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    axios.get(api_url+"list.php?i=list", {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        console.log(response);
        res.send(response.data);
    }).catch(() => {
        res.status(500).send();
    });
});

cocktailApiRouter.get('/drinks_by_letter', async (req: AuthenticatedRequest, res: Response) => {
    axios.get(`${api_url}search.php?f=${req.query.letter}` , {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err: any) => {
        console.log("ERROR "+err);
        res.status(500).send();
    });
});

export default cocktailApiRouter;