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
    recipe_id?: number;
    custom_recipe_id?: number;
    // add attributes of recipe tables
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
        `SELECT mi.recipe_id, mi.custom_recipe_id
         FROM menu_items mi
         WHERE mi.menu_id = $1`,
        [ menuId ]);
    if (menuResult.rowCount > 0) {
        menu["menu_items"] = menuItemsResult.rows;
    }

    return menu;
};