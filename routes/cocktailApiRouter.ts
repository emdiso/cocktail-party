import express, { Request, Response } from 'express';
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
    let letter = req.query.letter as string;
    letter = letter.substring(1,1);
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

cocktailApiRouter.get('/my_menus', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) return res.sendStatus(401);
    return psqlPool.query(
        `SELECT m.id, m.title, m.image_id, m.date_created, (SELECT count(*) FROM menu_items mi WHERE mi.menu_id = m.id) as item_count
         FROM menus m
         WHERE m.user_id = $1
         ORDER BY m.date_created DESC`,
        [ req.userId ]
    ).then(async (result: { rows: any; }) => {
        return res.json(result.rows);
    }).catch(() => {
        return res.sendStatus(500);
    });
})

cocktailApiRouter.get('/list_custom_recipes', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) return res.sendStatus(401);
    psqlPool.query(
        `SELECT cr.id, cr.image_id, cr."strDrink", cr."strAlcoholic", cr."strCategory", cr."strGlass", cr."strInstructions", cr."strIngredient1", cr."strIngredient2", cr."strIngredient3", cr."strIngredient4", cr."strIngredient5", cr."strIngredient6", cr."strIngredient7", cr."strIngredient8", cr."strIngredient9", cr."strIngredient10", cr."strIngredient11", cr."strIngredient12", cr."strIngredient13", cr."strIngredient14", cr."strIngredient15", cr."strMeasure1", cr."strMeasure2", cr."strMeasure3", cr."strMeasure4", cr."strMeasure5", cr."strMeasure6", cr."strMeasure7", cr."strMeasure8", cr."strMeasure9", cr."strMeasure10", cr."strMeasure11", cr."strMeasure12", cr."strMeasure13", cr."strMeasure14", cr."strMeasure15", cr."dateModified"
         FROM custom_recipes cr WHERE cr.user_id = $1`,
        [ req.userId ]
    ).then((result: { rows: any; }) => {
        res.json(result.rows);
    }).catch(() => {
        res.sendStatus(500);
    });
});

cocktailApiRouter.get('/drink_by_id', async (req: Request, res: Response) => {
    if (!req.query.id) return res.status(400).send("Missing id");
    return axios.get(`${api_url}lookup.php?i=${req.query.id}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        if (response.data.drinks.length === 0) {
            return res.status(400).send("Drink does not exist");
        }
        res.send(response.data.drinks[0]);
    }).catch((err: any) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
});

export default cocktailApiRouter;

