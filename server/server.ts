import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
// import { PassThrough } from 'stream';

dotenv.config();
const PORT = process.env.PORT || 3001;
const sysEnv = process.env.NODE_ENV || 'development';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const psqlEnv = require("../env.json");
let pool = new Pool(psqlEnv);
pool.connect().then(() => {
  console.log("Connected to database");
});

let saltRounds = 10;

// TODO: create a model/schema for the user object
//
// assuming our req.body looks like:
// {
//   username: string,
//   password: string, 
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

app.post("/auth/signup", (req, res) => {
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

app.post("/auth/login", (req, res) => {
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


if (sysEnv === 'development') {
  app.get("/healthcheck", async (req: Request, res: Response) => {
    res.send();
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});