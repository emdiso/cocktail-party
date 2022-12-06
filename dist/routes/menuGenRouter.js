"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const authUtils_1 = require("../utils/authUtils");
const dotenv_1 = __importDefault(require("dotenv"));
const cocktailApiUtils_1 = require("../utils/cocktailApiUtils");
const cors_1 = __importDefault(require("cors"));
const psqlConnection_1 = __importDefault(require("../utils/psqlConnection"));
const multer_1 = __importDefault(require("multer"));
const imageUtils_1 = require("../utils/imageUtils");
require('dotenv').config();
dotenv_1.default.config();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const menuGenRouter = express_1.default.Router();
menuGenRouter.use((0, cors_1.default)());
menuGenRouter.use(express_1.default.json());
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;
menuGenRouter.get('/menu_by_size', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let drinks = [];
    let size = Number(req.query.size);
    for (let i = 0; i < size; i++) {
        (0, cocktailApiUtils_1.randomDrinkPromise)()
            .then((response) => {
            if (!drinks.includes(response.data.drinks[0])) {
                drinks.push(response.data.drinks[0]);
            }
            else {
                i--;
            }
            if (drinks.length === size) {
                res.send(drinks);
            }
        }).catch((err) => {
            console.log("ERROR " + err);
            return res.status(500).send();
        });
    }
}));
const drinkByAlcoholicPromise = (alcoholic) => {
    return axios_1.default.get(`${api_url}filter.php?a=${alcoholic}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};
const drinkByIdPromise = (id) => {
    return axios_1.default.get(`${api_url}lookup.php?i=${id}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};
const drinkByIngredientPromise = (ingredient) => {
    return axios_1.default.get(`${api_url}filter.php?i=${ingredient}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};
menuGenRouter.post('/modify_menu_by_alcoholic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let menu = req.body;
    let expectedAlcoholic = Number(menu.alcoholicQuantity);
    let drinks = menu.menuRecipes;
    if (drinks === undefined) {
        return;
    }
    let alcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Non");
    });
    let actualAlcoholic = alcoholicDrinks.length;
    let difference = 0;
    let filter = "";
    let list = [];
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
    let replaceWith = [];
    for (let i = 0; i < difference; i++) {
        drinkByAlcoholicPromise(filter).then((response) => {
            let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
            let searchId = menu.menuRecipes.filter(function (item) {
                return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
            });
            if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink)) {
                replaceWith.push(response.data.drinks[randomIndex].idDrink);
            }
            else {
                i--;
            }
            if (replaceWith.length === difference) {
                let replaced = 0;
                replaceWith.forEach((drinkid, index) => {
                    drinkByIdPromise(drinkid).then((response) => {
                        let replace = list[index];
                        const i = menu.menuRecipes.indexOf(replace, 0);
                        menu.menuRecipes.splice(i, 1);
                        menu.menuRecipes.push(response.data.drinks[0]);
                        replaced++;
                        if (replaced === difference) {
                            return res.send(menu);
                        }
                    });
                });
            }
        }).catch((err) => {
            console.log("ERROR " + err);
            return res.status(500).send();
        });
    }
}));
menuGenRouter.post('/add_drink_with_ingredient', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let menu = req.body;
    let ingriedientsYes = menu.ingriedientsYes;
    let drinks = menu.menuRecipes;
    let alcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Non");
    });
    let replaceWith = [];
    for (let i = 0; i < ingriedientsYes.length; i++) {
        let ingredient = ingriedientsYes[i];
        drinkByIngredientPromise(ingredient).then((response) => {
            let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
            let searchId = menu.menuRecipes.filter(function (item) {
                return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
            });
            if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink)) {
                replaceWith.push(response.data.drinks[randomIndex].idDrink);
            }
            else {
                i--;
            }
            if (replaceWith.length === ingriedientsYes.length) {
                let replaced = 0;
                replaceWith.forEach((drinkid, index) => {
                    drinkByIdPromise(drinkid).then((response) => {
                        let alcoholic = response.data.drinks[0].strAlcoholic === "Alcoholic";
                        let replace = alcoholic ? alcoholicDrinks[index] : nonAlcoholicDrinks[index];
                        const i = menu.menuRecipes.indexOf(replace, 0);
                        menu.menuRecipes.splice(i, 1);
                        menu.menuRecipes.push(response.data.drinks[0]);
                        replaced++;
                        if (replaced === ingriedientsYes.length) {
                            return res.send(menu);
                        }
                    });
                });
            }
        });
    }
}));
function hasIngredient(drink, listToCheck) {
    let ingredients = [];
    for (let i = 1; i < 16; i++) {
        ingredients.push(drink[`strIngredient${i}`]);
    }
    const found = ingredients.some(r => listToCheck.includes(r));
    return found;
}
menuGenRouter.post('/remove_drink_with_ingredient', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let menu = req.body;
    let ingredientsNo = menu.ingriedientsNo;
    let drinks = menu.menuRecipes;
    let alcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Alcoholic");
    });
    let nonAlcoholicDrinks = drinks.filter(function (drink) {
        return drink.strAlcoholic.includes("Non");
    });
    // find out what to replace
    let expendable = [];
    drinks.forEach((drink) => {
        const found = hasIngredient(drink, ingredientsNo);
        if (found) {
            expendable.push(drink);
        }
        ;
    });
    let replaceWith = [];
    for (let i = 0; i < expendable.length; i++) {
        let drink = expendable[i];
        let filter = drink.strAlcoholic.includes("Alcoholic") ? "Alcoholic" : "Non_Alcoholic";
        let list = drink.strAlcoholic.includes("Alcoholic") ? alcoholicDrinks : nonAlcoholicDrinks;
        drinkByAlcoholicPromise(filter).then((response) => {
            let randomIndex = Math.floor(Math.random() * response.data.drinks.length);
            // TODO: seems inefficient, re-evaluate later. If updated, change it across the rest of the file
            let searchId = menu.menuRecipes.filter(function (item) {
                return item.idDrink.includes(response.data.drinks[randomIndex].idDrink);
            });
            if (searchId.length === 0 && !replaceWith.includes(response.data.drinks[randomIndex].idDrink) && !hasIngredient(response.data.drinks[randomIndex], ingredientsNo)) {
                replaceWith.push(response.data.drinks[randomIndex].idDrink);
            }
            else {
                i--;
            }
            if (replaceWith.length === expendable.length) {
                let replaced = 0;
                replaceWith.forEach((drinkid, index) => {
                    drinkByIdPromise(drinkid).then((response) => {
                        let replace = list[index];
                        const i = menu.menuRecipes.indexOf(replace, 0);
                        menu.menuRecipes.splice(i, 1);
                        menu.menuRecipes.push(response.data.drinks[0]);
                        replaced++;
                        if (replaced === expendable.length) {
                            return res.send(menu);
                        }
                    });
                });
            }
        }).catch((err) => {
            console.log("ERROR " + err);
            return res.status(500).send();
        });
    }
}));
menuGenRouter.post('/insert_full_menu', authUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // TODO: validate menu info more
    if (req.userId === undefined) {
        return res.sendStatus(401);
    }
    // TODO: Add error handling
    psqlConnection_1.default.query(`INSERT INTO menus (user_id, title) VALUES ($1, $2) RETURNING id`, [req.userId, body.title]).then((result) => __awaiter(void 0, void 0, void 0, function* () {
        if (body.recipes === undefined || body.recipes === null || body.recipes.length === 0) {
            return res.status(400).send("Missing Menu Items");
        }
        // TODO: change to gather all the promises and await the for loop.
        for (const recipe of body.recipes) {
            // TODO: Add security check: if custom recipe check user owns that custom recipe before inserting
            yield psqlConnection_1.default.query(`INSERT INTO menu_items (menu_id, api_recipe_id, custom_recipe_id) VALUES ($1, $2, $3)`, [result.rows[0].id, recipe.idDrink || null, recipe.id || null]);
        }
        return res.json({ menu_id: result.rows[0].id });
    })).catch((error) => {
        return res.status(500).send(error);
    });
}));
menuGenRouter.post('/insert_menu_image', authUtils_1.verifyToken, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // body = { menu_id }
    const authQueryResult = yield psqlConnection_1.default.query('SELECT image_id FROM menus WHERE id = $1 AND user_id = $2', [req.body.menu_id, req.userId]);
    if (authQueryResult.rowCount === 0) {
        return res.status(403).send("Access Forbidden");
    }
    const old_image_id = authQueryResult.rows[0].image_id;
    return (0, imageUtils_1.insertFile)(req).then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }
        // Delete Old image, TODO: Confirm this works correctly
        if (old_image_id) {
            try {
                psqlConnection_1.default.query("UPDATE images SET date_deleted = NOW() WHERE id = $1", [old_image_id]);
            }
            catch (error) {
                console.log(error);
            }
        }
        const image_id = result.data;
        return psqlConnection_1.default.query('UPDATE menus SET image_id = $1 WHERE id = $2 AND user_id = $3', [image_id, req.body.menu_id, req.userId]).then(() => {
            return res.send();
        }).catch(() => {
            return res.status(500).send();
        });
    });
}));
exports.default = menuGenRouter;
