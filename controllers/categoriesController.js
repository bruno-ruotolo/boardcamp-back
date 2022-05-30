import chalk from "chalk";

import db from "../db.js";

export async function getCategories(req, res) {
  const { offset, limit, order, desc } = req.query;

  try {
    const result = await db.query(
      `SELECT * FROM categories 
      ORDER BY ${order ? (desc === "true" ? order + " desc" : order) : false} 
      LIMIT ${limit ? limit : null}
      OFFSET ${offset ? offset : null} `);
    res.status(200).send(result.rows);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}

export async function postCategories(req, res) {
  const { categoriesBody } = res.locals
  try {
    await db.query(`INSERT INTO categories(name) VALUES($1)`, [categoriesBody.name]);
    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}