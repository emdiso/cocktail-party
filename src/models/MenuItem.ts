import Recipe from './Recipe';
import CustomRecipe from './CustomRecipe';


export default interface MenuItem {
    id: number;
    api_recipe_id?: number;
    custom_recipe_id?: number;
    recipe: CustomRecipe | Recipe;
}