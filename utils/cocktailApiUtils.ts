import { QueryResult } from "pg";
import dotenv from 'dotenv';
import psqlPool from "./psqlConnection";
import Menu from "../models/Menu";
import MenuItem from "../models/MenuItem";
import axios from "axios";


dotenv.config();
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

export const randomDrinkPromise = () => {
    return axios.get(`${api_url}random.php`, {
        headers: {
            "Authentication": `Bearer ${api_key}`,
        }
    });
};

export const retreiveAllMenuInfo = async (menuId: string, userId: string) => {
    const menuResult: QueryResult = await psqlPool.query(
        `SELECT m.id, m.image_id, m.title, m.date_created, (SELECT count(*) FROM menu_items mi WHERE mi.menu_id = m.id) as item_count
         FROM menus m
         WHERE m.id = $1 AND m.user_id = $2`,
        [ menuId, userId ]);
    if (menuResult.rowCount === 0) {
        return null;
    }
    menuResult.rows[0]["item_count"] = Number(menuResult.rows[0]["item_count"]);
    const menu: Menu = menuResult.rows[0];

    // TODO: Add error handling
    const menuItemsResult: QueryResult = await psqlPool.query(
        `SELECT mi.id, mi.api_recipe_id, mi.custom_recipe_id
         FROM menu_items mi
         WHERE mi.menu_id = $1`,
        [ menuId ]);
    if (menuResult.rowCount > 0) {
        const newItems = [] as MenuItem[];
        for (const item of menuItemsResult.rows) {
            const newItem = item;
            if (item.api_recipe_id !== null && item.api_recipe_id !== undefined) {
                // TODO: Add error handling!!!!!!
                const drinkData = (await axios.get(`${api_url}lookup.php?i=${item.api_recipe_id}`, {
                    headers: {
                        "Authentication": `Bearer ${api_key}`,
                    }
                })).data.drinks[0];
                newItem["recipe"] = drinkData;
            } else if (item.custom_recipe_id !== null && item.custom_recipe_id !== undefined) {
                // TODO: Remove user id from return, Add error Handling!!!!
                const customRecipeData = await psqlPool.query(
                    `SELECT cr.*
                     FROM custom_recipes cr
                     WHERE cr.id = $1`,
                    [ item.custom_recipe_id ]);
                if (customRecipeData.rowCount > 0) {
                    newItem["recipe"] = customRecipeData.rows[0];
                }
            }
            newItems.push(newItem);
        }
        menu["menu_items"] = newItems;
    }

    return menu;
};