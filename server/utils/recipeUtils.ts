import dotenv from 'dotenv';
import psqlPool from "./psqlConnection";
import { CustomRecipe } from "../models";


dotenv.config();

export const insertCustomRecipe = (user_id: string, recipe: CustomRecipe) => {
    return psqlPool.query(
        `INSERT INTO custom_recipes
         (user_id, "image_id", "strDrink", "strAlcoholic", "strCategory", "strGlass", "strInstructions",
         "strIngredient1", "strIngredient2", "strIngredient3", "strIngredient4", "strIngredient5",
         "strIngredient6", "strIngredient7", "strIngredient8", "strIngredient9", "strIngredient10",
         "strIngredient11", "strIngredient12", "strIngredient13", "strIngredient14", "strIngredient15",
         "strMeasure1", "strMeasure2", "strMeasure3", "strMeasure4", "strMeasure5", "strMeasure6", "strMeasure7",
         "strMeasure8", "strMeasure9", "strMeasure10", "strMeasure11", "strMeasure12", "strMeasure13", "strMeasure14", "strMeasure15", "dateModified")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
         RETURNING id`, [user_id, recipe.image_id, recipe.strDrink, recipe.strAlcoholic, recipe.strCategory, recipe.strGlass, recipe.strInstructions,
            recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3, recipe.strIngredient4, recipe.strIngredient5,
            recipe.strIngredient6, recipe.strIngredient7, recipe.strIngredient8, recipe.strIngredient9, recipe.strIngredient10,
            recipe.strIngredient11, recipe.strIngredient12, recipe.strIngredient13, recipe.strIngredient14, recipe.strIngredient15,
            recipe.strMeasure1, recipe.strMeasure2, recipe.strMeasure3, recipe.strMeasure4, recipe.strMeasure5, recipe.strMeasure6, recipe.strMeasure7,
            recipe.strMeasure8, recipe.strMeasure9, recipe.strMeasure10, recipe.strMeasure11, recipe.strMeasure12, recipe.strMeasure13,
            recipe.strMeasure14, recipe.strMeasure15, recipe.dateModified]);
};

export const updateCustomRecipe = (user_id: string, recipe: CustomRecipe) => {
    return psqlPool.query(
        `UPDATE custom_recipes
         SET "image_id"=$1, "strDrink"=$2, "strAlcoholic"=$3, "strCategory"=$4, "strInstructions"=$5, "strIngredient1"=$6,
         "strIngredient2"=$7, "strIngredient3"=$8, "strIngredient4"=$9, "strIngredient5"=$10, "strIngredient6"=$11,
         "strIngredient7"=$12, "strIngredient8"=$13, "strIngredient9"=$14, "strIngredient10"=$15, "strIngredient11"=$16,
         "strIngredient12"=$17, "strIngredient13"=$18, "strIngredient14"=$19, "strIngredient15"=$20, "strMeasure1"=$21,
         "strMeasure2"=$22, "strMeasure3"=$23, "strMeasure4"=$24, "strMeasure5"=$25, "strMeasure6"=$26, "strMeasure7"=$27,
         "strMeasure8"=$28, "strMeasure9"=$29, "strMeasure10"=$30, "strMeasure11"=$31, "strMeasure12"=$32, "strMeasure13"=$33,
         "strMeasure14"=$34, "strMeasure15"=$35, "dateModified"=$36
         WHERE "user_id"=${user_id} AND "id"=${recipe.id}`, [recipe.image_id, recipe.strDrink, recipe.strAlcoholic, 
        recipe.strCategory, recipe.strInstructions, recipe.strIngredient1, recipe.strIngredient2, recipe.strIngredient3,
        recipe.strIngredient4, recipe.strIngredient5, recipe.strIngredient6, recipe.strIngredient7, recipe.strIngredient8,
        recipe.strIngredient9, recipe.strIngredient10, recipe.strIngredient11, recipe.strIngredient12, recipe.strIngredient13,
        recipe.strIngredient14, recipe.strIngredient15, recipe.strMeasure1, recipe.strMeasure2, recipe.strMeasure3, 
        recipe.strMeasure4, recipe.strMeasure5, recipe.strMeasure6, recipe.strMeasure7, recipe.strMeasure8, recipe.strMeasure9,
        recipe.strMeasure10, recipe.strMeasure11, recipe.strMeasure12, recipe.strMeasure13, recipe.strMeasure14, recipe.strMeasure15,
        recipe.dateModified]);
}