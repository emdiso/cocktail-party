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
exports.insertFile = void 0;
const psqlConnection_1 = __importDefault(require("./psqlConnection"));
const insertFile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file === undefined) {
        return { statusCode: 400, message: "No File Found" };
    }
    else {
        const { originalname, mimetype, size, buffer } = file;
        if (size > 2000000) { // Current File size limit is about 2 mb
            return { statusCode: 400, message: "File is too large" };
        }
        return yield psqlConnection_1.default.query('INSERT INTO images (user_id, file_name, mime_type, img) VALUES ($1, $2, $3, $4) RETURNING id', [req.userId, originalname, mimetype, buffer]).then((result) => {
            return { statusCode: 200, message: "OK", data: result.rows[0].id };
        }).catch((error) => {
            console.log(error);
            return { statusCode: 500, message: "Insert Failed" };
        });
    }
});
exports.insertFile = insertFile;
