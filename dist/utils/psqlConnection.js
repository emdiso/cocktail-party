"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const psqlEnv = require("../../env.json"); // Convert to typsecript import statment
let psqlPool = new pg_1.Pool(psqlEnv);
psqlPool.connect().then(() => {
    console.log("Connected to database");
});
exports.default = psqlPool;
