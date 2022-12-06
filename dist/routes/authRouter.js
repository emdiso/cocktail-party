"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const psqlConnection_1 = __importDefault(require("../utils/psqlConnection"));
const authUtils_1 = require("../utils/authUtils");
var cors = require('cors');
const authRouter = express_1.default.Router();
authRouter.use(cors());
const saltRounds = 10;
function validUsername(username) {
    if (username === undefined
        || typeof username != "string" ||
        !(username.length <= 30 && username.length > 0)) {
        return false;
    }
    return true;
}
function validEmail(email) {
    if (email === undefined
        || typeof email != "string" ||
        !(email.length <= 50 && email.length > 0) ||
        (email.substring(email.length - 4, email.length) != ".com" &&
            email.substring(email.length - 4, email.length) != ".edu" &&
            email.substring(email.length - 4, email.length) != ".org") ||
        !/[.@]/g.test(email)) {
        return false;
    }
    return true;
}
function validPassword(password) {
    if (password === undefined
        || typeof password != "string" ||
        !(password.length <= 30 && password.length >= 8) ||
        !/[!#$%&*?]/g.test(password) ||
        !/\d/.test(password)) {
        return false;
    }
    return true;
}
// TODO: add the endpoints for auth below to a router inside of "authRoute" then import the router here and use it instead
authRouter.post("/signup", (req, res) => {
    let username = req.body.username;
    let plaintextPassword = req.body.password;
    let email = req.body.email;
    if (!validUsername(username)) {
        return res.status(401).send("Invalid username"); // TODO: We need to make this more descriptive so users know why
    }
    if (!validPassword(plaintextPassword)) {
        return res.status(401).send("Invalid password"); // TODO: We need to make this more descriptive so users know why
    }
    if (!validEmail(email)) {
        return res.status(401).send("Invalid email"); // TODO: We need to make this more descriptive so users know why
    }
    // TODO: Possibly create a procedure in the database to do this instead
    //        - it'll be way more effecient as we won't keep going back and forth with the DB
    //        - and less prone to security risks
    psqlConnection_1.default.query("SELECT hashed_password FROM users WHERE username = $1", [
        username,
    ])
        .then((result) => {
        if (result.rows.length > 0) {
            // username does exist
            return res.status(401).send("username already exists");
        }
        else {
            bcrypt_1.default
                .hash(plaintextPassword, saltRounds)
                .then((hashedPassword) => {
                psqlConnection_1.default.query("INSERT INTO users (username, hashed_password, email) VALUES ($1, $2, $3) RETURNING id", [username, hashedPassword, email])
                    .then((result) => {
                    // account created
                    console.log(username, "account created");
                    return res.json({ accessToken: (0, authUtils_1.generateAccessToken)(result.rows[0].id) });
                })
                    .catch((error) => {
                    // insert failed
                    console.log(error);
                    return res.status(500).send("insertion failed"); // TODO: prob should tell the client this
                });
            })
                .catch((error) => {
                // bcrypt crashed
                console.log(error);
                return res.status(500).send();
            });
        }
    });
});
authRouter.post("/login", (req, res) => {
    let username = req.body.username;
    let plaintextPassword = req.body.password;
    psqlConnection_1.default.query(`SELECT u.id, u.hashed_password FROM users u WHERE u.username = '${username}'`)
        .then((result) => {
        if (result.rows.length === 0) {
            // username doesn't exist
            return res.status(401).send("invalid credentials"); // Don't make username specific error message because it could allow people to figure out valid usernames
        }
        const userInfo = result.rows[0];
        bcrypt_1.default
            .compare(plaintextPassword, userInfo.hashed_password)
            .then((passwordMatched) => {
            if (passwordMatched) {
                res.json({ accessToken: (0, authUtils_1.generateAccessToken)(userInfo.id) });
            }
            else {
                res.status(401).send("invalid credentials");
            }
        })
            .catch((error) => {
            // bcrypt crashed
            console.log(error);
            res.status(500).send();
        });
    })
        .catch((error) => {
        // select crashed
        console.log(error);
        res.status(500).send();
    });
});
authRouter.get("/userInfo", authUtils_1.verifyToken, (req, res) => {
    let userId = req.userId;
    psqlConnection_1.default.query("SELECT username, email FROM users WHERE id=$1", [userId])
        .then((response) => {
        let userInfo = response.rows[0];
        res.json({ "username": userInfo.username, "email": userInfo.email });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).send();
    });
});
exports.default = authRouter;
