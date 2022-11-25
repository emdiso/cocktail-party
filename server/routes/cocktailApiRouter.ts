import express, { Request, response, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import dotenv from 'dotenv';
import { randomDrinkPromise, retreiveAllMenuInfo } from '../utils/cocktailApiUtils';
import cors from 'cors';
import psqlPool from '../utils/psqlConnection';
require('dotenv').config();


dotenv.config();
const cocktailApiRouter = express.Router();
cocktailApiRouter.use(cors());
cocktailApiRouter.use(express.json());

const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

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

cocktailApiRouter.get('/list_ingredients', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    axios.get(api_url + "list.php?i=list", {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
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

cocktailApiRouter.get('/random_drink', async (req: Request, res: Response) => {
    randomDrinkPromise().then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});

cocktailApiRouter.get('/random_drink_by_ingredient', async (req: Request, res: Response) => {
    const ingredient = req.query.ingredient;
    return axios.get(`${api_url}filter.php?i=${ingredient}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        const randInt = Math.floor(Math.random() * response.data.drinks.length);
        res.send(response.data.drinks[randInt]);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});

const ingredientOptionsPromise = () => {
    return axios.get(`${api_url}list.php?i=list`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};

cocktailApiRouter.get('/ingredient_options', async (req: Request, res: Response) => {
    ingredientOptionsPromise().then((response: AxiosResponse) => {
        res.send(response.data);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});

cocktailApiRouter.get('/category_options', async (req: Request, res: Response) => {
    axios.get(`${api_url}list.php?c=list`, {
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

cocktailApiRouter.get('/list_menus', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) return res.sendStatus(401);
    psqlPool.query(
        'SELECT m.id, m.title, m.image_id FROM menus m WHERE m.user_id = $1',
        [ req.userId ]
    ).then((result) => {
        res.json({ menus: result.rows });
    }).catch(() => {
        res.sendStatus(500);
    });
});


export default cocktailApiRouter;

