import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import dotenv from 'dotenv';
import { randomDrinkPromise } from '../utils/cocktailApiUtils';
import cors from 'cors';
import psqlPool from '../utils/psqlConnection';
import { Recipe, CustomRecipe, MenuGenModel } from '../models';
import multer from 'multer';
import { insertFile } from '../utils/imageUtils';
require('dotenv').config();


dotenv.config();
const upload = multer({ storage: multer.memoryStorage() });
const menuGenRouter = express.Router();
menuGenRouter.use(cors());
menuGenRouter.use(express.json());

const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

menuGenRouter.get('/menu_by_size', async (req: Request, res: Response) => {
    let drinks: Recipe[] = [];
    let size = Number(req.query.size);

    for (let i = 0; i < size; i++) {
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

const drinkByAlcoholicPromise = (alcoholic: string) => {
    return axios.get(`${api_url}filter.php?a=${alcoholic}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
}

const drinkByIdPromise = (id: string) => {
    return axios.get(`${api_url}lookup.php?i=${id}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
}

const drinkByIngredientPromise = (ingredient: string) => {
    return axios.get(`${api_url}filter.php?i=${ingredient}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
}

menuGenRouter.post('/modify_menu_by_alcoholic', async (req: Request, res: Response) => {
    let menu: MenuGenModel = req.body;
    let expectedAlcoholic = Number(menu.alcoholicQuantity);
    let drinks: Recipe[] = menu.menuRecipes;
    if (drinks === undefined) {
        return;
    }

    let alcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Non");
    });

    let actualAlcoholic = alcoholicDrinks.length;
    let difference = 0;
    let filter = "";
    let list: any[] = [];

    if (actualAlcoholic > expectedAlcoholic) {
        difference = actualAlcoholic - expectedAlcoholic;
        filter = "Non_Alcoholic";
        list = alcoholicDrinks;
    }

    if (expectedAlcoholic > actualAlcoholic) {
        difference = expectedAlcoholic - actualAlcoholic;
        filter = "Alcoholic";
        list = nonAlcoholicDrinks;
    }

    let replaceWith: string[] = [];
    for (let i = 0; i < difference; i++) {
        drinkByAlcoholicPromise(filter).then(
            (response: AxiosResponse) => {
                let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
                let searchId = menu.menuRecipes.filter(function (item: any) {
                    return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
                });

                if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink)) {
                    replaceWith.push(response.data.drinks[randomIndex].idDrink);
                } else {
                    i--;
                }

                if (replaceWith.length === difference) {
                    let replaced = 0;
                    replaceWith.forEach((drinkid: string, index: number) => {
                        drinkByIdPromise(drinkid).then(
                            (response: any) => {
                                let replace = list[index];
                                const i = menu.menuRecipes.indexOf(replace, 0);
                                menu.menuRecipes.splice(i, 1);
                                menu.menuRecipes.push(response.data.drinks[0]);
                                replaced++;

                                if (replaced === difference) {
                                    return res.send(menu);
                                }
                            }
                        )
                    });
                }
            }
        ).catch((err: any) => {
            console.log("ERROR " + err);
            return res.status(500).send();
        });
    }

});

menuGenRouter.post('/add_drink_with_ingredient', async (req: Request, res: Response) => {
    let menu: MenuGenModel = req.body;
    let ingriedientsYes = menu.ingriedientsYes;
    let drinks = menu.menuRecipes;

    let alcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Non");
    });

    let replaceWith: string[] = [];
    for (let i = 0; i < ingriedientsYes.length; i++) {
        let ingredient = ingriedientsYes[i];

        drinkByIngredientPromise(ingredient).then(
            (response: any) => {
                let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
                let searchId = menu.menuRecipes.filter(function (item: any) {
                    return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
                });

                if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink)) {
                    replaceWith.push(response.data.drinks[randomIndex].idDrink);
                } else {
                    i--;
                }

                if (replaceWith.length === ingriedientsYes.length) {
                    let replaced = 0;
                    replaceWith.forEach((drinkid: string, index: number) => {
                        drinkByIdPromise(drinkid).then(
                            (response: any) => {
                                let alcoholic = response.data.drinks[0].strAlcoholic === "Alcoholic";

                                let replace = alcoholic ? alcoholicDrinks[index] : nonAlcoholicDrinks[index];
                                const i = menu.menuRecipes.indexOf(replace, 0);
                                menu.menuRecipes.splice(i, 1);
                                menu.menuRecipes.push(response.data.drinks[0]);
                                replaced++;

                                if (replaced === ingriedientsYes.length) {
                                    return res.send(menu);
                                }
                            }
                        )
                    });
                }
            }
        )
    }
});

function hasIngredient(drink: any, listToCheck: string[]) {
    let ingredients: string[] = [];
    for (let i = 1; i < 16; i++) {
        ingredients.push(drink[`strIngredient${i}`])
    }
    const found = ingredients.some(r => listToCheck.includes(r));

    return found;
}

menuGenRouter.post('/remove_drink_with_ingredient', async (req: Request, res: Response) => {
    let menu: MenuGenModel = req.body;
    let ingredientsNo = menu.ingriedientsNo;
    let drinks = menu.menuRecipes;

    let alcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks: any[] = drinks.filter(function (drink: any) {
        return drink.strAlcoholic.includes("Non");
    });

    // find out what to replace
    let expendable: any[] = [];
    drinks.forEach((drink: any) => {
        const found = hasIngredient(drink, ingredientsNo);
        if (found) {
            expendable.push(drink);
        };
    });

    let replaceWith: string[] = [];
    for (let i = 0; i < expendable.length; i++) {
        let drink = expendable[i];
        let filter = drink.strAlcoholic.includes("Alcoholic") ? "Alcoholic" : "Non_Alcoholic";
        let list = drink.strAlcoholic.includes("Alcoholic") ? alcoholicDrinks : nonAlcoholicDrinks;
        drinkByAlcoholicPromise(filter).then(
            (response: AxiosResponse) => {
                let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
                // TODO: seems inefficient, re-evaluate later. If updated, change it across the rest of the file
                let searchId = menu.menuRecipes.filter(function (item: any) {
                    return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
                });

                if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink) && !hasIngredient(response.data.drinks[randomIndex], ingredientsNo)) {
                    replaceWith.push(response.data.drinks[randomIndex].idDrink);
                } else {
                    i--;
                }

                if (replaceWith.length === expendable.length) {
                    let replaced = 0;
                    replaceWith.forEach((drinkid: string, index: number) => {
                        drinkByIdPromise(drinkid).then(
                            (response: any) => {
                                let replace = list[index];
                                const i = menu.menuRecipes.indexOf(replace, 0);
                                menu.menuRecipes.splice(i, 1);
                                menu.menuRecipes.push(response.data.drinks[0]);
                                replaced++;

                                if (replaced === expendable.length) {
                                    return res.send(menu);
                                }
                            }
                        )
                    });
                }
            }
        ).catch((err: any) => {
            console.log("ERROR " + err);
            return res.status(500).send();
        });

    }
});

interface InsertFullMenuBody {
    title: string;
    recipes: (Recipe | CustomRecipe)[];
}

menuGenRouter.post('/insert_full_menu', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    const body: InsertFullMenuBody = req.body;

    // TODO: validate menu info more

    if (req.userId === undefined) {
        return res.sendStatus(401);
    }
    
    // TODO: Add error handling
    psqlPool.query(`INSERT INTO menus (user_id, title) VALUES ($1, $2) RETURNING id`, [req.userId, body.title]).then(async (result) => {
        if (body.recipes === undefined || body.recipes === null || body.recipes.length === 0) {
            return res.status(400).send("Missing Menu Items");
        }
        // TODO: change to gather all the promises and await the for loop.
        for (const recipe of body.recipes) {
            
            // TODO: Add security check: if custom recipe check user owns that custom recipe before inserting

            await psqlPool.query(
                `INSERT INTO menu_items (menu_id, api_recipe_id, custom_recipe_id) VALUES ($1, $2, $3)`, 
                [result.rows[0].id, (recipe as Recipe).idDrink || null, (recipe as CustomRecipe).id || null]
                );
        }
        return res.json({ menu_id: result.rows[0].id });
    }).catch((error) => {
        return res.status(500).send(error);
    });
});

menuGenRouter.post('/insert_menu_image', verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
    // body = { menu_id }
    const authQueryResult = await psqlPool.query('SELECT image_id FROM menus WHERE id = $1 AND user_id = $2', [req.body.menu_id, req.userId]);
    if (authQueryResult.rowCount === 0) {
        return res.status(403).send("Access Forbidden");
    }
    const old_image_id = authQueryResult.rows[0].image_id;

    return insertFile(req).then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }

        if (old_image_id) {
            try {
                psqlPool.query("UPDATE images SET date_deleted = NOW() WHERE id = $1", [old_image_id]);
            } catch (error) {
                console.log(error);
            }
        }

        const image_id = result.data;

        return psqlPool.query(
            'UPDATE menus SET image_id = $1 WHERE id = $2 AND user_id = $3',
            [image_id, req.body.menu_id, req.userId]
        ).then(() => {
            return res.send();
        }).catch(() => {
            return res.status(500).send();
        });
    });

});

menuGenRouter.delete("/delete_menu", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    const menu_id = req.query.menuId;

    return psqlPool.query(`DELETE FROM menus m WHERE m.id = ${menu_id} AND m.user_id = ${req.userId}`).then((result) => {
        return res.send("OK");
    }).catch(() => {
        return res.status(400).send();
    })
})


export default menuGenRouter;