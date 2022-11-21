import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { verifyToken, AuthenticatedRequest } from '../utils/authUtils';
import dotenv from 'dotenv';
import { retreiveAllMenuInfo } from '../utils/cocktailApiUtils';
import { Quantity } from '../utils/models';
var cors = require('cors');
require('dotenv').config();

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

cocktailApiRouter.get('/random_drink', async (req: Request, res: Response) => {
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

cocktailApiRouter.get('/menu_by_size', async (req: AuthenticatedRequest, res: Response) => {
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

const drinkByGlassPromise = (glass: string) => {
    return axios.get(`${api_url}filter.php?g=${glass}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
}

cocktailApiRouter.post('/modify_menu_by_alcoholic', async (req: AuthenticatedRequest, res: Response) => {
    let menu = req.body;
    let expectedAlcoholic = Number(req.body.alcoholicQuantity);
    let drinks = req.body.menuDrinks;

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
        console.log(`we have to replace ${actualAlcoholic - expectedAlcoholic} alcoholic drinks with non-alcoholic drinks`);
        difference = actualAlcoholic - expectedAlcoholic;
        filter = "Non_Alcoholic";
        list = alcoholicDrinks;
    }

    if (expectedAlcoholic > actualAlcoholic) {
        console.log(`we have to replace ${expectedAlcoholic - actualAlcoholic} non-alcoholic drinks with alcoholic drinks`);
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

cocktailApiRouter.get('/ingredient_options', async (req: Request, res: Response) => {
    axios.get(`${api_url}list.php?i=list`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    })
        .catch((err: any) => {
            console.log("ERROR " + err);
            res.status(500).send();
        });
});

cocktailApiRouter.get('/glass_options', async (req: Request, res: Response) => {
    axios.get(`${api_url}list.php?g=list`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response: AxiosResponse) => {
        res.send(response.data);
    })
        .catch((err: any) => {
            console.log("ERROR " + err);
            res.status(500).send();
        });
});

cocktailApiRouter.post('/modify_menu_by_glass', async (req: AuthenticatedRequest, res: Response) => {
    let menu = req.body;
    let glassMap = req.body.glassMap;
    let drinks = req.body.menuDrinks;

    console.log(glassMap);
    glassMap.forEach((quant: Quantity) => {
        let glass = quant.item;

        if (glass !== "None") {
            // drinks to replace
            let replaceThese: any[] = [];
            let expendable = drinks.filter(function (x: any) {
                return !x.strGlass.includes(glass);
            });
            replaceThese.push(...expendable);

            let notExpendable = drinks.filter(function (x: any) {
                return x.strGlass.includes(glass);
            });
            let expected = quant.amount;
            let actual = notExpendable.length;

            let difference = 0;
            if (expected > actual) {
                console.log(`we have to add ${expected - actual} drinks that use glass ${glass}`);
                difference = expected - actual;
            }

            if (actual > expected) {
                console.log(`we have to remove ${actual - expected} drinks that use glass ${glass}`);
                difference = actual - expected;
            }

            // now actually do the replacing with this logic but by glass -- 
            // let replaceWith: string[] = [];
            // for (let i = 0; i < difference; i++) {
            //     drinkByAlcoholicPromise(filter).then(
            //         (response: AxiosResponse) => {
            //             let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
            //             let searchId: string[] = menu.menuDrinks.filter(function (item: any) {
            //                 return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
            //             });

            //             if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink)) {
            //                 replaceWith.push(response.data.drinks[randomIndex].idDrink);
            //             } else {
            //                 i--;
            //             }

            //             if (replaceWith.length === difference) {
            //                 let replaced = 0;
            //                 replaceWith.forEach((drinkid: string, index: number) => {
            //                     drinkByIdPromise(drinkid).then(
            //                         (response: any) => {
            //                             let replace = list[index];
            //                             const i = menu.menuDrinks.indexOf(replace, 0);
            //                             menu.menuDrinks.splice(i, 1);
            //                             menu.menuDrinks.push(response.data.drinks[0]);
            //                             replaced++;

            //                             if (replaced === difference) {
            //                                 return res.send(menu);
            //                             }
            //                         }
            //                     )
            //                 });
            //             }
            //         }
            //     ).catch((err: any) => {
            //         console.log("ERROR " + err);
            //         return res.status(500).send();
            //     });
            // }
        }
    });
});

export default cocktailApiRouter;