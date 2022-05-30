import joi from "joi";

import db from "../../db.js";

export async function categoriesSchema(req, res, next) {
  const { name } = req.body;
  const categoriesBody = { name };

  const catSchema = joi.object({
    name: joi.string().required()
  })

  const { error } = catSchema.validate(categoriesBody, { abortEarly: false });

  if (error) return res.status(400).send(error.message);

  try {
    const result = await db.query(`SELECT name FROM categories`);
    const categoriesNames = result.rows;

    for (let categorieName of categoriesNames) {
      if (categorieName.name === name) return res.sendStatus(409)
    }

    res.locals.categoriesBody = categoriesBody;
    next();
  } catch (e) {
    res.sendStatus(500);
    console.log(chalk.red.bold(e));
  }
}