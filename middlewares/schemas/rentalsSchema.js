import chalk from "chalk";
import dayjs from "dayjs";
import joi from "joi";

import db from "../../db.js";

export async function rentalsSchema(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const reqBody = { customerId, gameId, daysRented };

  const rentSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().greater(0).required()
  });

  const { error } = rentSchema.validate(reqBody, { abortEarly: false });
  if (error) return res.status(400).send(error.details.map(detail => detail.message));
  try {
    const customer = await db.query(`SELECT id FROM customers WHERE id = ${customerId}`);
    const game = await db.query(`SELECT * FROM games WHERE id = ${gameId}`);
    const rentals = await db.query(
      `SELECT * FROM rentals WHERE "gameId" = ${gameId} and "returnDate" IS null`
    );
    if ((customer.rows.length === 0 || game.rows.length === 0)) return res.sendStatus(400);
    if (game.rows[0].stockTotal <= rentals.rows.length) return res.sendStatus(400);

    const rentBody = {
      ...reqBody,
      rentDate: dayjs().format("YYYY-MM-DD"),
      originalPrice: daysRented * game.rows[0].pricePerDay,
      returnDate: null,
      delayFee: null,
    }

    res.locals.rentBody = rentBody;
    next();
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}