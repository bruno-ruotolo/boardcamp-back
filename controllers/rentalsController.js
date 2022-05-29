import chalk from "chalk";

import db from "../db.js";

export async function getRentals(req, res) {
  let { customerId, gameId } = req.query;
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
        categoryname: rental.categoryname
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