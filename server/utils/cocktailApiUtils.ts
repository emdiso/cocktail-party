import { QueryResult } from "pg";
import psqlPool from "./psqlConnection";

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
    // add attributes of recipe tables -- I made them look like the external api's data (even though we all dislike their naming/structure)
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
}

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
        menu["menu_items"] = menuItemsResult.rows;
        for (const item of menu["menu_items"]) {
            if (item.api_recipe_id !== null) {
                // make api call to external
            }
        }
    }
    

    return menu;
};