import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import dotenv from 'dotenv';
import { randomDrinkPromise } from '../utils/cocktailApiUtils';
import cors from 'cors';
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

export default menuGenRouter;