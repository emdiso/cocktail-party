import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import dotenv from 'dotenv';
import { randomDrinkPromise } from '../utils/cocktailApiUtils';
import cors from 'cors';
import Menu from '../models/Menu';
import psqlPool from '../utils/psqlConnection';
require('dotenv').config();


dotenv.config();
const menuGenRouter = express.Router();
menuGenRouter.use(cors());
menuGenRouter.use(express.json());

const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

menuGenRouter.get('/menu_by_size', async (req: AuthenticatedRequest, res: Response) => {
    let drinks: any[] = [];
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

menuGenRouter.post('/modify_menu_by_alcoholic', async (req: AuthenticatedRequest, res: Response) => {
    let menu = req.body;
    let expectedAlcoholic = Number(menu.alcoholicQuantity);
    let drinks = menu.menuDrinks;

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
                let searchId: string[] = menu.menuDrinks.filter(function (item: any) {
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
                                const i = menu.menuDrinks.indexOf(replace, 0);
                                menu.menuDrinks.splice(i, 1);
                                menu.menuDrinks.push(response.data.drinks[0]);
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

menuGenRouter.post('/add_drink_with_ingredient', async (req: AuthenticatedRequest, res: Response) => {
    let menu = req.body;
    let ingriedientsYes = menu.ingriedientsYes;
    let drinks = menu.menuDrinks;

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
                let searchId: string[] = menu.menuDrinks.filter(function (item: any) {
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
                                const i = menu.menuDrinks.indexOf(replace, 0);
                                menu.menuDrinks.splice(i, 1);
                                menu.menuDrinks.push(response.data.drinks[0]);
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

menuGenRouter.post('/remove_drink_with_ingredient', async (req: AuthenticatedRequest, res: Response) => {
    let menu = req.body;
    let ingredientsNo = menu.ingriedientsNo;
    let drinks = menu.menuDrinks;

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
                let searchId: string[] = menu.menuDrinks.filter(function (item: any) {
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
                                const i = menu.menuDrinks.indexOf(replace, 0);
                                menu.menuDrinks.splice(i, 1);
                                menu.menuDrinks.push(response.data.drinks[0]);
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

menuGenRouter.post('/insert_full_menu', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    const menu: Menu = req.body;

    // TODO: validate menu info more

    if (req.userId === undefined) {
        return res.sendStatus(401);
    }
    
    // TODO: Add error handling
    psqlPool.query(`INSERT INTO menus (user_id, title) VALUES ($1, $2) RETURNING id`, [req.userId, menu.title]).then(async (result) => {
        if (menu.menu_items === undefined) {
            return res.status(400).send("Missing Menu Items");
        }
        // TODO: change to gather all the promises and await the for loop.
        for (const item of menu.menu_items) {
            let cr_id = undefined as unknown as number;
            if (item.api_recipe_id === null || item.api_recipe_id === undefined) {
                // TODO: rewrite this using a for loop so it's not a mess
                cr_id = (await psqlPool.query(
                    `INSERT INTO custom_recipes
                     (user_id, "strDrink", "strAlcoholic", "strCategory", "strGlass", "strInstructions",
                         "strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5",
                         "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10",
                         "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15",
                         "strMeasure1", "strMeasure2", "strMeasure3", "strMeasure4", "strMeasure5", "strMeasure6", "strMeasure7",
                         "strMeasure8", "strMeasure9", "strMeasure10", "strMeasure11", "strMeasure12", "strMeasure13", "strMeasure14", "strMeasure15", "dateModified")
                      VALUES
                     ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)
                     RETURNING id`, [req.userId, item.recipe.strDrink, item.recipe.strAlcoholic, item.recipe.strCategory, item.recipe.strGlass, item.recipe.strInstructions,
                        item.recipe.strIngredient1, item.recipe.strIngredient2, item.recipe.strIngredient3, item.recipe.strIngredient4, item.recipe.strIngredient5,
                        item.recipe.strIngredient6, item.recipe.strIngredient7, item.recipe.strIngredient8, item.recipe.strIngredient9, item.recipe.strIngredient10,
                        item.recipe.strIngredient11, item.recipe.strIngredient12, item.recipe.strIngredient13, item.recipe.strIngredient14, item.recipe.strIngredient15,
                        item.recipe.strMeasure1, item.recipe.strMeasure2, item.recipe.strMeasure3, item.recipe.strMeasure4, item.recipe.strMeasure5, item.recipe.strMeasure6, item.recipe.strMeasure7,
                        item.recipe.strMeasure8, item.recipe.strMeasure9, item.recipe.strMeasure10, item.recipe.strMeasure11, item.recipe.strMeasure12, item.recipe.strMeasure13,
                        item.recipe.strMeasure14, item.recipe.strMeasure15, item.recipe.dateModified])).rows[0].id;
            }
            await psqlPool.query(
                `INSERT INTO menu_items (menu_id, api_recipe_id, custom_recipe_id) VALUES ($1, $2, $3)`, 
                [result.rows[0].id, item.api_recipe_id || null, cr_id || null] // TODO: change to get custom id from prior insert
                );
        }
        return res.json({ menu_id: result.rows[0].id });
    }).catch((error) => {
        return res.status(500).send(error);
    });
});


export default menuGenRouter;