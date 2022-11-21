import { QueryResult } from "pg";
import dotenv from 'dotenv';
import psqlPool from "./psqlConnection";
import Menu from "../models/Menu";
import MenuItem from "../models/MenuItem";
import { RecipeKeys } from "../models/Recipe";
import axios from "axios";

// export interface Menu {
//     id: number;
// 	user_id: number;
// 	image_id: number;
// 	title: number;
//     item_count: number;
//     menu_items?: MenuItem[];
// }

// export interface MenuItem {
//     id: number;
//     api_recipe_id?: number;
//     custom_recipe_id?: number;
//     image_id?: number;
// 	strDrink: string;
// 	strAlcoholic: string;
// 	strCategory: string;
// 	strGlass: string;
//     strInstructions: string;
//     strIngredient1: string;
//     strIngredient2: string;
//     strIngredient3: string;
//     strIngredient4: string;
//     strIngredient5: string;
//     strIngredient6: string;
//     strIngredient7: string;
//     strIngredient8: string;
//     strIngredient9: string;
//     strIngredient10: string;
//     strIngredient11: string;
//     strIngredient12: string;
//     strIngredient13: string;
//     strIngredient14: string;
//     strIngredient15: string;
//     strMeasure1: string;
//     strMeasure2: string;
//     strMeasure3: string;
//     strMeasure4: string;
//     strMeasure5: string;
//     strMeasure6: string;
//     strMeasure7: string;
//     strMeasure8: string;
//     strMeasure9: string;
//     strMeasure10: string;
//     strMeasure11: string;
//     strMeasure12: string;
//     strMeasure13: string;
//     strMeasure14: string;
//     strMeasure15: string;
//     dateModified: string;
// }



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