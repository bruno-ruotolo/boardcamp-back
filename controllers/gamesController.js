import chalk from "chalk";
import db from "../db.js";

export async function getGames(req, res) {
  let { name } = req.query;
  const { offset, limit, order, desc } = req.query;

  if (!name) { name = '' }
  else { name = name.toLowerCase(); }

  try {
    const result = await db.query(
      `SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories ON categories.id = games."categoryId"
      WHERE LOWER(games.name) LIKE '${name}%'
      ORDER BY ${order ? (desc === "true" ? order + " desc" : order) : false} 
      LIMIT ${limit ? limit : null}
      OFFSET ${offset ? offset : null}`);

    res.status(200).send(result.rows);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e))
  }
}

export async function postGames(req, res) {
  const { gamesBody } = res.locals;
  const { name, image, stockTotal, categoryId, pricePerDay } = gamesBody;
  try {
    await db.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(201);
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e))
  }
}