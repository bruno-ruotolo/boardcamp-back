import chalk from "chalk";
import dayjs from "dayjs";

import db from "../db.js";

export async function getRentals(req, res) {
  let { customerId, gameId } = req.query;
  const { offset, limit, order, desc } = req.query;
  const rentalFinal = [];

  if (!customerId) customerId = null;
  if (!gameId) gameId = null;

  try {
    const result = await db.query(
      `SELECT rentals.*, 
      customers.id as "customerId", customers.name as "customerName", 
      games.id as "gameId", games.name as "gameName", games."categoryId",
      categories.name as "categoryName"
      FROM rentals 
      JOIN customers ON  rentals."customerId" = customers.id
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON games."categoryId" = categories.id
      WHERE (${customerId} IS NULL OR "customerId" = ${customerId})
      AND (${gameId} IS NULL OR "gameId" = ${gameId})
      ORDER BY ${order ? (desc === "true" ? order + " desc" : order) : false} 
      LIMIT ${limit ? limit : null}
      OFFSET ${offset ? offset : null} 
      `
    )
    const rentals = result.rows;

    for (let rental of rentals) {
      const {
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee } = rental;

      const rentalInfos = {
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee
      }

      const customer = { id: rental.customerId, name: rental.customerName }

      const game = {
        id: rental.gameId,
        name: rental.gameName,
        categoryId: rental.categoryId,
        categoryName: rental.categoryName
      }

      rentalFinal.push({ ...rentalInfos, customer, game });
    }

    res.send(rentalFinal);

  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function postRentals(req, res) {
  const { rentBody } = res.locals;
  const { customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee } = rentBody;

  try {
    await db.query(
      `INSERT INTO rentals (
        "customerId", 
        "gameId", 
        "daysRented", 
        "rentDate", 
        "originalPrice", 
        "returnDate", 
        "delayFee") 
        VALUES ($1,$2,$3,$4,$5,$6,$7)`
      , [customerId, gameId, daysRented, rentDate, originalPrice, returnDate, delayFee]);

    res.sendStatus(201)
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function postReturnRental(req, res) {
  const { id } = req.params

  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = ${id}`);

    if (result.rows.length === 0) return res.sendStatus(404);
    if (result.rows[0].returnDate !== null) return res.sendStatus(400);

    const { rentDate, originalPrice, daysRented } = result.rows[0];
    const daysFee = Math.floor((dayjs() - rentDate) / (1000 * 60 * 60 * 24)) - daysRented;
    const pricePerDay = originalPrice / daysRented;
    const returnDate = dayjs().format("YYYY-MM-DD").toString();
    const delayFee = daysFee * pricePerDay;

    await db.query(
      `UPDATE rentals 
      SET "returnDate" = '${returnDate}',
      "delayFee" = ${delayFee >= 0 ? delayFee : 0}
      WHERE id = ${id}`)
    res.sendStatus(200);
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params

  try {
    const result = await db.query(`SELECT * FROM rentals WHERE id = ${id}`);

    if (result.rows.length === 0) return res.sendStatus(404);
    if (result.rows[0].returnDate !== null) return res.sendStatus(400);

    await db.query(`DELETE FROM rentals WHERE id = ${id}`)
    res.sendStatus(200);
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}