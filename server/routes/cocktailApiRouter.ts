import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import cors from 'cors';
import dotenv from 'dotenv';
import { retreiveAllMenuInfo } from '../utils/cocktailApiUtils';

dotenv.config();
const cocktailApiRouter = express.Router();
cocktailApiRouter.use(cors());
cocktailApiRouter.use(express.json());

const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

cocktailApiRouter.get('/list_ingredients', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    axios.get(api_url + "list.php?i=list", {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR "+err);
        res.status(500).send();
    });
});

cocktailApiRouter.get('/drinks_by_letter', async (req: Request, res: Response) => {
    axios.get(`${api_url}search.php?f=${req.query.letter}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});


const randomDrinkPromise = () => {
    return axios.get(`${api_url}random.php`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
}

cocktailApiRouter.get('/random-drink', async (req: Request, res: Response) => {
    randomDrinkPromise().then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});

cocktailApiRouter.get('/full_menu', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    if (req.userId === undefined) {
        return res.sendStatus(401);
    }
    const menuId = req.query.menuId;
    if (menuId === undefined || menuId === '' || typeof menuId !== 'string') {
        return res.status(400).send("Invalid Menu Id");
    }
    retreiveAllMenuInfo(menuId, req.userId).then((menu) => {
        if (menu === null) {
            return res.status(400).send("Menu Not Found");
        }
        return res.json(menu);
    });
});

cocktailApiRouter.get('/menu_by_size', async (req: AuthenticatedRequest, res: Response) => {
    let drinks: any[] = [];
    let size = Number(req.query.size);

    for (let i = 0; i < size; i++) {
        console.log(drinks.length);
        randomDrinkPromise()
            .then((response: AxiosResponse) => {
                if (!drinks.includes(response.data.drinks[0])) {
                    drinks.push(response.data.drinks[0]);
                }
                else {
                    i--;
                }

                if (drinks.length === size) {
                    res.send(drinks);
                }
            }).catch((err: any) => {
                console.log("ERROR " + err);
                return res.status(500).send();
            });
    }

});

export default cocktailApiRouter;