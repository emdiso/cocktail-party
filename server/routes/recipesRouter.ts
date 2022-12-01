import express, { Request, Response } from 'express';
import psqlPool from '../utils/psqlConnection';
import dotenv from 'dotenv';
import multer from 'multer';
import { AuthenticatedRequest, verifyToken } from '../utils/authUtils';
import { insertCustomRecipe } from '../utils/recipeUtils';
import { insertFile } from '../utils/imageUtils';

var cors = require('cors');
var bodyParser = require('body-parser');
dotenv.config();
const recipesRouter = express.Router();
recipesRouter.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
recipesRouter.use(bodyParser.urlencoded({ extended: true }));

recipesRouter.post('/insert', verifyToken, upload.single("image"), (req: AuthenticatedRequest, res: Response) => {
    const promise = insertFile(req);
    return promise.then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }

        req.body.recipe.image_id = result.data.toString();
        req.body.recipe.dateModified = Date.now();

        if (req.userId === undefined) return res.status(401).send();
        insertCustomRecipe(req.userId, req.body.recipe);
    });
})

export default recipesRouter;