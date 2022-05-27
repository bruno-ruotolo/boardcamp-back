import chalk from "chalk";
import db from "../db.js";

export async function getCategories(req, res) {
  try {
    const result = await db.query(`SELECT * FROM categories`);
    res.status(200).send(result.rows);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}

export async function postCategories(req, res) {
  const { categoriesBody } = res.locals
  try {
    await db.query(`INSERT INTO categories (name) VALUES ($1)`, [categoriesBody.name]);
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}