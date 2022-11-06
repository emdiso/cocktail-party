import { Pool } from 'pg';


const psqlEnv = require("../../env.json"); // Convert to typsecript import statment
let psqlPool = new Pool(psqlEnv);
psqlPool.connect().then(() => {
  console.log("Connected to database");
});

export default psqlPool;