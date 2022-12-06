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
exports.retreiveAllMenuInfo = exports.randomDrinkPromise = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const psqlConnection_1 = __importDefault(require("./psqlConnection"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;
const randomDrinkPromise = () => {
    return axios_1.default.get(`${api_url}random.php`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};
exports.randomDrinkPromise = randomDrinkPromise;
const retreiveAllMenuInfo = (menuId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const menuResult = yield psqlConnection_1.default.query(`SELECT m.id, m.image_id, m.title, m.date_created, (SELECT count(*) FROM menu_items mi WHERE mi.menu_id = m.id) as item_count
         FROM menus m
         WHERE m.id = $1 AND m.user_id = $2`, [menuId, userId]);
    if (menuResult.rowCount === 0) {
        return null;
    }
    menuResult.rows[0]["item_count"] = Number(menuResult.rows[0]["item_count"]);
    const menu = menuResult.rows[0];
    // TODO: Add error handling
    const menuItemsResult = yield psqlConnection_1.default.query(`SELECT mi.id, mi.api_recipe_id, mi.custom_recipe_id
         FROM menu_items mi
         WHERE mi.menu_id = $1`, [menuId]);
    if (menuResult.rowCount > 0) {
        const newItems = [];
        for (const item of menuItemsResult.rows) {
            const newItem = item;
            if (item.api_recipe_id !== null && item.api_recipe_id !== undefined) {
                // TODO: Add error handling!!!!!!
                const drinkData = (yield axios_1.default.get(`${api_url}lookup.php?i=${item.api_recipe_id}`, {
                    headers: {
                        "Authentication": `Bearer ${api_key}`,
                    }
                })).data.drinks[0];
                newItem["recipe"] = drinkData;
            }
            else if (item.custom_recipe_id !== null && item.custom_recipe_id !== undefined) {
                // TODO: Remove user id from return, Add error Handling!!!!
                const customRecipeData = yield psqlConnection_1.default.query(`SELECT cr.*
                     FROM custom_recipes cr
                     WHERE cr.id = $1`, [item.custom_recipe_id]);
                if (customRecipeData.rowCount > 0) {
                    newItem["recipe"] = customRecipeData.rows[0];
                }
            }
            newItems.push(newItem);
        }
        menu["menu_items"] = newItems;
    }
    return menu;
});
exports.retreiveAllMenuInfo = retreiveAllMenuInfo;
