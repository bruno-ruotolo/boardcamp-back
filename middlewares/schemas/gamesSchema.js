import db from "../../db.js";
import chalk from "chalk";
import joi from "joi";

export async function gamesSchema(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body
  const gamesBody = { name, image, stockTotal, categoryId, pricePerDay };
  const arrIds = [];

  try {

    const gamSchema = joi.object({
      name: joi.string().required(),
      image: joi.any().required(),
      stockTotal: joi.number().greater(0).required(),
      categoryId: joi.number().required(),
      pricePerDay: joi.number().greater(0).required()
    });

    const { error } = gamSchema.validate(gamesBody, { abortEarly: false });

    if (error) return res.status(400).send(error.details.map(detail => detail.message));

    const categoriesIds = await db.query(`SELECT id FROM categories`);
    for (let categorieId of categoriesIds.rows) {
      arrIds.push(categorieId.id);
    }

    if (!arrIds.includes(categoryId)) return res.status(400).send("Categoria Inexistente");

    const result = await db.query(`SELECT name FROM games`);
    const gamesNames = result.rows;

    for (let gameName of gamesNames) {
      if (gameName.name === name) return res.sendStatus(409)
    }

    res.locals.gamesBody = gamesBody;
    next();
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}