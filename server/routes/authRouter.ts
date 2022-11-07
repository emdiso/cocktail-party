import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import psqlPool from '../utils/psqlConnection';
import { generateAccessToken } from '../utils/authUtils';


const authRouter = express.Router();
dotenv.config();

// interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }

let saltRounds = 10;


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

// TODO: add the endpoints for auth below to a router inside of "authRoute" then import the router here and use it instead
authRouter.post("/signup", (req: Request, res: Response) => {
  console.log("test");
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

  // TODO: Possibly create a procedure in the database to do this instead (it'll be way more effecient and less prone to security risks)
  psqlPool.query("SELECT hashed_password FROM users WHERE username = $1", [
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
            psqlPool.query(
              "INSERT INTO users (username, hashed_password, email) VALUES ($1, $2, $3)",
              [username, hashedPassword, email]
            )
              .then(() => {
                // account created
                console.log(username, "account created");
                return res.json({ accessToken: generateAccessToken(username)});
              })
              .catch((error: any) => {
                // insert failed
                console.log(error);
                return res.status(500).send("insertion failed"); // TODO: prob should tell the client this
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

authRouter.post("/login", (req: Request, res: Response) => {
  let username = req.body.username;
  let plaintextPassword = req.body.password;

  psqlPool.query(`SELECT * FROM users WHERE username = '${username}'`)
    .then((result: any) => {
      if (result.rows.length === 0) {
        // username doesn't exist
        return res.status(401).send("invalid credentials"); // Don't make username specific error message because it could allow people to figure out valid usernames
      }
      let hashedPassword = result.rows[0].hashed_password;
      bcrypt
        .compare(plaintextPassword, hashedPassword)
        .then((passwordMatched: boolean) => {
          if (passwordMatched) {
            res.json({ accessToken: generateAccessToken(username)});
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

export default authRouter;