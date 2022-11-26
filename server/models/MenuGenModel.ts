import CustomRecipe from "./CustomRecipe";
import Recipe from "./Recipe";

export interface MenuGenModel {
    title: string;
    menuRecipes: Recipe[];
    menuCustomRecipes: CustomRecipe[];
    size: number;
    alcoholicQuantity: number;
    ingriedientsYes: string[];
    ingriedientsNo: string[];
  }