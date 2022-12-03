import express, { Response } from 'express';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';
import { insertCustomRecipe } from '../utils/recipeUtils';
import { insertFile } from '../utils/imageUtils';
import CustomRecipe from '../models/CustomRecipe';

var cors = require('cors');
dotenv.config();
const recipesRouter = express.Router();
recipesRouter.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

recipesRouter.get('/get_custom_recipe', verifyToken, (req: AuthenticatedRequest, res: Response) => {
    return psqlPool.query("SELECT cr.* FROM custom_recipes cr WHERE cr.id = $1", [req.query.id]).then((result) => {
        if (result.rowCount > 0) {
            const cr: CustomRecipe = result.rows[0];
            if (cr.user_id == req.userId) {
                cr.user_id = undefined;
                return res.json(cr);
            }
            return res.status(401).send();
        }
        return res.status(400).send();
    }).catch(() => {
        return res.status(500).send();
    });
});

recipesRouter.post('/insert', verifyToken, upload.single("image"), (req: AuthenticatedRequest, res: Response) => {
    let recipe = {} as CustomRecipe;

    recipe = {
        id: req.body.id,
        image_id: req.body.image_id,
        strDrink: req.body.strDrink,
        strAlcoholic: req.body.strAlcoholic,
        strCategory: req.body.strCategory,
        strGlass: req.body.strGlass,
        strInstructions: req.body.strInstructions,
        strIngredient1: req.body.strIngredient1,
        strIngredient2: req.body.strIngredient2,
        strIngredient3: req.body.strIngredient3,
        strIngredient4: req.body.strIngredient4,
        strIngredient5: req.body.strIngredient5,
        strIngredient6: req.body.strIngredient6,
        strIngredient7: req.body.strIngredient7,
        strIngredient8: req.body.strIngredient8,
        strIngredient9: req.body.strIngredient9,
        strIngredient10: req.body.strIngredient10,
        strIngredient11: req.body.strIngredient11,
        strIngredient12: req.body.strIngredient12,
        strIngredient13: req.body.strIngredient13,
        strIngredient14: req.body.strIngredient14,
        strIngredient15: req.body.strIngredient15,
        strMeasure1: req.body.strMeasure1,
        strMeasure2: req.body.strMeasure2,
        strMeasure3: req.body.strMeasure3,
        strMeasure4: req.body.strMeasure4,
        strMeasure5: req.body.strMeasure5,
        strMeasure6: req.body.strMeasure6,
        strMeasure7: req.body.strMeasure7,
        strMeasure8: req.body.strMeasure8,
        strMeasure9: req.body.strMeasure9,
        strMeasure10: req.body.strMeasure10,
        strMeasure11: req.body.strMeasure11,
        strMeasure12: req.body.strMeasure12,
        strMeasure13: req.body.strMeasure13,
        strMeasure14: req.body.strMeasure14,
        strMeasure15: req.body.strMeasure15,
        dateModified:  req.body.dateModified
    };

    const promise = insertFile(req);
    return promise.then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }

        recipe.image_id = result.data.toString();

        if (req.userId === undefined) return res.status(401).send();

        const recipePromise = insertCustomRecipe(req.userId, recipe)
        return recipePromise.then((result) => {
            return res.status(200).send(result.rows[0].id);
        });
    });
})

export default recipesRouter;