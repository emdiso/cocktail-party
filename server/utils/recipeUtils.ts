import { QueryResult } from "pg";
import dotenv from 'dotenv';
import psqlPool from "./psqlConnection";
import Menu from "../models/Menu";
import MenuItem from "../models/MenuItem";
import axios from "axios";
import { CustomRecipe } from "../models";


dotenv.config();
const api_key = process.env.PUBLIC_DEV_COCKTAIL_API_KEY;
const api_url = process.env.COCKTAIL_API_MAIN_URL;

export const insertCustomRecipe = (user_id: string, recipe: CustomRecipe) => {
    return psqlPool.query(
        `INSERT INTO custom_recipes
         (user_id, "strDrink", "strAlcoholic", "strCategory", "strGlass", "strInstructions",
             "strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5",
             "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10",
             "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15",
             "strMeasure1", "strMeasure2", "strMeasure3", "strMeasure4", "strMeasure5", "strMeasure6", "strMeasure7",
             "strMeasure8", "strMeasure9", "strMeasure10", "strMeasure11", "strMeasure12", "strMeasure13", "strMeasure14", "strMeasure15", "dateModified")
          VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)
         RETURNING id`, [user_id, recipe.strDrink, recipe.strAlcoholic, recipe.strCategory, recipe.strGlass, recipe.strInstructions,
            recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3, recipe.strIngredient4, recipe.strIngredient5,
            recipe.strIngredient6, recipe.strIngredient7, recipe.strIngredient8, recipe.strIngredient9, recipe.strIngredient10,
            recipe.strIngredient11, recipe.strIngredient12, recipe.strIngredient13, recipe.strIngredient14, recipe.strIngredient15,
            recipe.strMeasure1, recipe.strMeasure2, recipe.strMeasure3, recipe.strMeasure4, recipe.strMeasure5, recipe.strMeasure6, recipe.strMeasure7,
            recipe.strMeasure8, recipe.strMeasure9, recipe.strMeasure10, recipe.strMeasure11, recipe.strMeasure12, recipe.strMeasure13,
            recipe.strMeasure14, recipe.strMeasure15, recipe.dateModified]);
};