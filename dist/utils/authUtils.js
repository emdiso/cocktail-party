"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.handleOptionalToken = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send('A token is required for authentication of the form \"Bearer ******\"');
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN || "");
        if (typeof decodedToken === "object") {
            req.userId = decodedToken.userId; // This allows our endpoints to determine the username/userid
        }
    }
    catch (err) {
        return res.status(401).send('Invalid Token');
    }
    next();
};
exports.verifyToken = verifyToken;
const handleOptionalToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN || "");
            if (typeof decodedToken === "object") {
                req.userId = decodedToken.userId; // This allows our endpoints to determine the username/userid
            }
        }
        catch (err) { }
    }
    next();
};
exports.handleOptionalToken = handleOptionalToken;
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.SECRET_TOKEN || "", {
        expiresIn: '1h',
    });
};
exports.generateAccessToken = generateAccessToken;
