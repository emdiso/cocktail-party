import { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { PassThrough } from 'stream';

dotenv.config();
const PORT = process.env.PORT || 3000;

let express = require("express");
const app: Express = express();
app.use(express.json());

let { Pool } = require("pg");
let bcrypt = require("bcrypt");
let env = require("../env.json");

let pool = new Pool(env);
pool.connect().then(() => {
  console.log("Connected to database");
});

let saltRounds = 10;

// assuming our req.body looks like:
// {
//   username: string,
//   plaintextpassword: string, 
//   email: string, 
// } 
// we can include some kind of personalized part of a profile later

function validUsername(username: any) {
  if (username === undefined
    || typeof username != "string" ||
    !(username.length <= 30 && username.length > 0)) {
    return false;
  }
  return true;
}
function validEmail(email: any) {
  if (email === undefined
    || typeof email != "string" ||
    !(email.length <= 50 && email.length > 0) ||
    email.substring(email.length - 4, email.length) != ".com" ||
    !/[.@]/g.test(email)) {
    return false;
  }
  return true;
}
function validPassword(password: any) {
  if (password === undefined
    || typeof password != "string" ||
    !(password.length <= 30 && password.length >= 8) ||
    !/[!#$%&*?]/g.test(password) ||
    !/\d/.test(password)) {
    return false;
  }
  return true;
}

app.post("/api/user", (req, res) => {
  let username = req.body.username;
  let plaintextPassword = req.body.plaintextPassword;
  let email = req.body.email;

  if (!validUsername(username)) {
    return res.status(401).send("Invalid username");
  }
  if (!validPassword(plaintextPassword)) {
    return res.status(401).send("Invalid password");
  }
  if (!validEmail(email)) {
    return res.status(401).send("Invalid email");
  }

  pool.query("SELECT hashed_password FROM users WHERE username = $1", [
    username,
  ])
    .then((result: any) => {
      if (result.rows.length > 0) {
        // username does exist
        return res.status(401).send("username already exists");
      }
      else {
        bcrypt
          .hash(plaintextPassword, saltRounds)
          .then((hashedPassword: string) => {
            pool.query(
              "INSERT INTO users (username, hashed_password, email) VALUES ($1, $2, $3)",
              [username, hashedPassword, email]
            )
              .then(() => {
                // account created
                console.log(username, "account created");
                return res.status(200).send();
              })
              .catch((error: any) => {
                // insert failed
                console.log(error);
                return res.status(500).send("insertion failed");
              });
          })
          .catch((error: any) => {
            // bcrypt crashed
            console.log(error);
            return res.status(500).send();
          });
      }
    });
});

app.post("/api/login", (req, res) => {
  let username = req.body.username;
  let plaintextPassword = req.body.plaintextPassword;

  pool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((result: any) => {
      if (result.rows.length === 0) {
        // username doesn't exist
        return res.status(401).send("username doesn't exist");
      }
      let hashedPassword = result.rows[0].hashed_password;
      bcrypt
        .compare(plaintextPassword, hashedPassword)
        .then((passwordMatched: boolean) => {
          if (passwordMatched) {
            res.status(200).send("user validated");
          } else {
            res.status(401).send("invalid credentials");
          }
        })
        .catch((error: any) => {
          // bcrypt crashed
          console.log(error);
          res.status(500).send();
        });
    })
    .catch((error: any) => {
      // select crashed
      console.log(error);
      res.status(500).send();
    });
});

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});