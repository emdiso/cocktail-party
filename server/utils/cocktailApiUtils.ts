import { QueryResult } from "pg";
import dotenv from 'dotenv';
import psqlPool from "./psqlConnection";
import axios from "axios";

export interface Menu {
    id: number;
	user_id: number;
	image_id: number;
	title: number;
    item_count: number;
    menu_items?: MenuItem[];
}

export interface MenuItem {
    id: number;
    api_recipe_id?: number;
    custom_recipe_id?: number;
    image_id?: number;
	strDrink: string;
	strAlcoholic: string;
	strCategory: string;
	strGlass: string;
    strInstructions: string;
    strIngredient1: string;
    strIngredient2: string;
    strIngredient3: string;
    strIngredient4: string;
    strIngredient5: string;
    strIngredient6: string;
    strIngredient7: string;
    strIngredient8: string;
    strIngredient9: string;
    strIngredient10: string;
    strIngredient11: string;
    strIngredient12: string;
    strIngredient13: string;
    strIngredient14: string;
    strIngredient15: string;
    strMeasure1: string;
    strMeasure2: string;
    strMeasure3: string;
    strMeasure4: string;
    strMeasure5: string;
    strMeasure6: string;
    strMeasure7: string;
    strMeasure8: string;
    strMeasure9: string;
    strMeasure10: string;
    strMeasure11: string;
    strMeasure12: string;
    strMeasure13: string;
    strMeasure14: string;
    strMeasure15: string;
    dateModified: string;
}

// TODO: Possibly refactor later to generate list directly from Interface
export const MenuItemKeys = ["id", "api_recipe_id", "custom_recipe_id", "image_id", "strDrink", "strAlcoholic", "strCategory",
    "strGlass", "strInstructions", "strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5",
    "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10", "strIngredient11", "strIngredient12",
    "strIngredient13", "strIngredient14", "strIngredient15", "strMeasure1", "strMeasure2", "strMeasure3", "strMeasure4", "strMeasure5",
    "strMeasure6", "strMeasure7", "strMeasure8", "strMeasure9", "strMeasure10", "strMeasure11", "strMeasure12",
    "strMeasure13", "strMeasure14", "strMeasure15", "dateModified"];

dotenv.config();
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL; 

export const retreiveAllMenuInfo = async (menuId: string, userId: string) => {
    const menuResult: QueryResult = await psqlPool.query(
        `SELECT m.id, m.image_id, m.title, (SELECT count(*) FROM menu_items mi WHERE mi.menu_id = m.id) as item_count
         FROM menus m
         WHERE m.id = $1 AND m.user_id = $2`,
        [ menuId, userId ]);
    if (menuResult.rowCount === 0) {
        return null;
    }
    menuResult.rows[0]["item_count"] = Number(menuResult.rows[0]["item_count"]);
    const menu: Menu = menuResult.rows[0];

    const menuItemsResult: QueryResult = await psqlPool.query(
        `SELECT mi.id, mi.api_recipe_id, cr.id as custom_recipe_id, cr.*
         FROM menu_items mi LEFT JOIN custom_recipes cr ON mi.custom_recipe_id = cr.id
         WHERE mi.menu_id = $1`,
        [ menuId ]);
    if (menuResult.rowCount > 0) {
        const newItems = [] as MenuItem[];
        for (const item of menuItemsResult.rows) {
            const newItem = item;
            if (item.api_recipe_id !== null && item.api_recipe_id !== undefined) {
                const drink = (await axios.get(`${api_url}lookup.php?i=${item.api_recipe_id}`, {
                    headers: {
                        "Authentication": `Bearer ${api_key}`,
                    }
                })).data.drinks[0];
                for (const key of MenuItemKeys) {
                    if (key in drink) {
                        newItem[key] = drink[key];
                    }
                }
            }
            newItems.push(newItem);
        }
        menu["menu_items"] = newItems;
    }

    return menu;
};