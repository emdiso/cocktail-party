import express, { Response } from 'express';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';
import { insertCustomRecipe, updateCustomRecipe } from '../utils/recipeUtils';
import { insertFile } from '../utils/imageUtils';
import CustomRecipe from '../models/CustomRecipe';

var cors = require('cors');
dotenv.config();
const recipesRouter = express.Router();
recipesRouter.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

recipesRouter.get('/custom_recipe', verifyToken, (req: AuthenticatedRequest, res: Response) => {
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

recipesRouter.post('/upsert_custom_recipe', verifyToken, upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
    let custom_recipe: CustomRecipe = req.body;

    if (!req.userId) return res.status(401).send();

    if (req.file) {
        console.log("attempt to insert file");
        const imgInsertResult = await insertFile(req);
        
        if (imgInsertResult.statusCode !== 200) {
            return res.status(imgInsertResult.statusCode).send(imgInsertResult.message);
        }

        custom_recipe.image_id = imgInsertResult.data.toString();
    } else {
        if (custom_recipe.image_id) {
            const trueImgId = await psqlPool.query(`SELECT id FROM images WHERE user_id=${req.userId} AND id=${custom_recipe.image_id}`);
            if (trueImgId.rowCount === 0) {
                custom_recipe.image_id = undefined;
            }
        }
    }

    if (custom_recipe.id) {
        console.log("attempt to modify cr");
        const recipePromise = updateCustomRecipe(req.userId, custom_recipe);
        return recipePromise.then((result) => {
            return res.send(result.rows[0].id.toString());
        }).catch(() => {
            return res.status(500).send();
        });
    } else {
        console.log("attempt to insert cr");
        const recipePromise = insertCustomRecipe(req.userId, custom_recipe);
        return recipePromise.then((result) => {
            return res.send(result.rows[0].id.toString());
        }).catch(() => {
            return res.status(500).send();
        });
    }
})

export default recipesRouter;