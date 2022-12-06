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
require('dotenv').config();
dotenv_1.default.config();
const cocktailApiRouter = express_1.default.Router();
cocktailApiRouter.use((0, cors_1.default)());
cocktailApiRouter.use(express_1.default.json());
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;
cocktailApiRouter.get('/full_menu', authUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.userId === undefined) {
        return res.sendStatus(401);
    }
    const menuId = req.query.menuId;
    if (menuId === undefined || menuId === '' || typeof menuId !== 'string') {
        return res.status(400).send("Invalid Menu Id");
    }
    (0, cocktailApiUtils_1.retreiveAllMenuInfo)(menuId, req.userId).then((menu) => {
        if (menu === null) {
            return res.status(400).send("Menu Not Found");
        }
        return res.json(menu);
    });
}));
cocktailApiRouter.get('/list_ingredients', authUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get(api_url + "list.php?i=list", {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
cocktailApiRouter.get('/drinks_by_letter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get(`${api_url}search.php?f=${req.query.letter}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
cocktailApiRouter.get('/random_drink', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, cocktailApiUtils_1.randomDrinkPromise)().then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
cocktailApiRouter.get('/random_drink_by_ingredient', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredient = req.query.ingredient;
    return axios_1.default.get(`${api_url}filter.php?i=${ingredient}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response) => {
        const randInt = Math.floor(Math.random() * response.data.drinks.length);
        res.send(response.data.drinks[randInt]);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
const ingredientOptionsPromise = () => {
    return axios_1.default.get(`${api_url}list.php?i=list`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};
cocktailApiRouter.get('/ingredient_options', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    ingredientOptionsPromise().then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
cocktailApiRouter.get('/category_options', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    axios_1.default.get(`${api_url}list.php?c=list`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
cocktailApiRouter.get('/my_menus', authUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId)
        return res.sendStatus(401);
    return psqlConnection_1.default.query(`SELECT m.id, m.title, m.image_id, m.date_created, (SELECT count(*) FROM menu_items mi WHERE mi.menu_id = m.id) as item_count
         FROM menus m
         WHERE m.user_id = $1
         ORDER BY m.date_created DESC`, [req.userId]).then((result) => __awaiter(void 0, void 0, void 0, function* () {
        return res.json(result.rows);
    })).catch(() => {
        return res.sendStatus(500);
    });
}));
cocktailApiRouter.get('/list_custom_recipes', authUtils_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId)
        return res.sendStatus(401);
    psqlConnection_1.default.query(`SELECT cr.id, cr.image_id, cr."strDrink", cr."strAlcoholic", cr."strCategory", cr."strGlass", cr."strInstructions", cr."strIngredient1", cr."strIngredient2", cr."strIngredient3", cr."strIngredient4", cr."strIngredient5", cr."strIngredient6", cr."strIngredient7", cr."strIngredient8", cr."strIngredient9", cr."strIngredient10", cr."strIngredient11", cr."strIngredient12", cr."strIngredient13", cr."strIngredient14", cr."strIngredient15", cr."strMeasure1", cr."strMeasure2", cr."strMeasure3", cr."strMeasure4", cr."strMeasure5", cr."strMeasure6", cr."strMeasure7", cr."strMeasure8", cr."strMeasure9", cr."strMeasure10", cr."strMeasure11", cr."strMeasure12", cr."strMeasure13", cr."strMeasure14", cr."strMeasure15", cr."dateModified"
         FROM custom_recipes cr WHERE cr.user_id = $1`, [req.userId]).then((result) => {
        res.json(result.rows);
    }).catch(() => {
        res.sendStatus(500);
    });
}));
cocktailApiRouter.get('/drink_by_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.id)
        return res.status(400).send("Missing id");
    return axios_1.default.get(`${api_url}lookup.php?i=${req.query.id}`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    }).then((response) => {
        if (response.data.drinks.length === 0) {
            return res.status(400).send("Drink does not exist");
        }
        res.send(response.data.drinks[0]);
    }).catch((err) => {
        console.log("ERROR " + err);
        res.status(500).send();
    });
}));
exports.default = cocktailApiRouter;
