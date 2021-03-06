import chalk from "chalk";
import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors"

import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";
import customersRouter from "./routers/customersRouter.js";
import rentalsRouter from "./routers/rentalsRouter.js";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

//routers
app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter)
app.use(rentalsRouter)

//server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(chalk.green.bold("Server ON Port " + port));
});