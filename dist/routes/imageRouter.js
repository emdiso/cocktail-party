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
const imageUtils_1 = require("../utils/imageUtils");
var cors = require('cors');
dotenv_1.default.config();
const imageRouter = express_1.default.Router();
imageRouter.use(cors());
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
imageRouter.get("/display", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageId = req.query.imageId;
    if (imageId === null || imageId === undefined || imageId === "") {
        return res.status(400).send("imageId parameter is required");
    }
    psqlConnection_1.default.query(`SELECT i.id, i.mime_type, i.img FROM images i WHERE i.id = ${imageId} AND i.date_deleted IS NULL`).then((result) => {
        if (result.rows.length === 0) {
            return res.status(400).send("Image Not Found");
        }
        else {
            const data = result.rows[0];
            res.contentType(data.mime_type);
            return res.send(Buffer.from(data.img, 'binary'));
        }
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
}));
imageRouter.post("/store", authUtils_1.verifyToken, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = (0, imageUtils_1.insertFile)(req);
    return promise.then((result) => {
        if (result.statusCode !== 200) {
            return res.status(result.statusCode).send(result.message);
        }
        return res.send(result.data.toString());
    });
}));
exports.default = imageRouter;
