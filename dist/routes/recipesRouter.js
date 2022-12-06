"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const psqlConnection_1 = __importDefault(require("../utils/psqlConnection"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const authUtils_1 = require("../utils/authUtils");
const recipeUtils_1 = require("../utils/recipeUtils");
const imageUtils_1 = require("../utils/imageUtils");
var cors = require('cors');
dotenv_1.default.config();
const recipesRouter = express_1.default.Router();
recipesRouter.use(cors());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
recipesRouter.get('/custom_recipe', authUtils_1.verifyToken, (req, res) => {
    return psqlConnection_1.default.query("SELECT cr.* FROM custom_recipes cr WHERE cr.id = $1", [req.query.id]).then((result) => {
        if (result.rowCount > 0) {
            const cr = result.rows[0];
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
recipesRouter.post('/upsert_custom_recipe', authUtils_1.verifyToken, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let custom_recipe = req.body;
    if (!req.userId)
        return res.status(401).send();
    if (req.file) {
        const imgInsertResult = yield (0, imageUtils_1.insertFile)(req);
        if (imgInsertResult.statusCode !== 200) {
            return res.status(imgInsertResult.statusCode).send(imgInsertResult.message);
        }
        // TODO: Confirm this works correctly
        if (custom_recipe.image_id) {
            try {
                psqlConnection_1.default.query("UPDATE images SET date_deleted = NOW() WHERE id = $1", [custom_recipe.image_id]);
            }
            catch (error) {
                console.log(error);
            }
        }
        custom_recipe.image_id = imgInsertResult.data.toString();
    }
    else {
        if (custom_recipe.image_id) {
            const trueImgId = yield psqlConnection_1.default.query(`SELECT id FROM images WHERE user_id=${req.userId} AND id=${custom_recipe.image_id}`);
            if (trueImgId.rowCount === 0) {
                custom_recipe.image_id = undefined;
            }
        }
    }
    if (custom_recipe.id) {
        const recipePromise = (0, recipeUtils_1.updateCustomRecipe)(req.userId, custom_recipe);
        return recipePromise.then((result) => {
            return res.send(result.rows[0].id.toString());
        }).catch(() => {
            return res.status(500).send();
        });
    }
    else {
        const recipePromise = (0, recipeUtils_1.insertCustomRecipe)(req.userId, custom_recipe);
        return recipePromise.then((result) => {
            return res.send(result.rows[0].id.toString());
        }).catch(() => {
            return res.status(500).send();
        });
    }
}));
exports.default = recipesRouter;
