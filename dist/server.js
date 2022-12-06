"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const cocktailApiRouter_1 = __importDefault(require("./routes/cocktailApiRouter"));
const imageRouter_1 = __importDefault(require("./routes/imageRouter"));
const recipesRouter_1 = __importDefault(require("./routes/recipesRouter"));
const authUtils_1 = require("./utils/authUtils");
const menuGenRouter_1 = __importDefault(require("./routes/menuGenRouter"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const sysEnv = process.env.NODE_ENV || 'development';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (sysEnv === 'development') {
    app.get("/healthcheck", authUtils_1.verifyToken, (req, res) => {
        res.sendStatus(200);
    });
}
app.use('/auth', authRouter_1.default);
app.use('/cocktail_api', cocktailApiRouter_1.default);
app.use('/image', imageRouter_1.default);
app.use('/menu_gen', menuGenRouter_1.default);
app.use('/recipe', recipesRouter_1.default);
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
