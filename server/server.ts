import express, { Express, Request, Response } from 'express';

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});