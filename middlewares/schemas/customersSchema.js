import chalk from "chalk";
import joi from "joi";

import db from "../../db.js";

export async function customersSchema(req, res, next) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;
  const customersBody = { name, phone, cpf, birthday };

  const custSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().length(11).required(),
    birthday: joi.date().iso().greater('1800-1-1').less('2022-5-27').required()
  });

  const { error } = custSchema.validate(customersBody, { abortEarly: false });
  if (error) return res.status(400).send(error.details.map(detail => detail.message));

  try {
    const cpfUser = await db.query(`SELECT id FROM customers WHERE cpf=$1`, [cpf]);
    const result = await db.query(`SELECT * FROM customers`);

    for (let cpfRow of result.rows) {
      if (id && cpfUser.rows[0]) {
        if (cpfUser.rows[0].id !== parseInt(id)) {
          return res.sendStatus(409);
        } else {
          break;
        }
      } else {
        if (cpfRow.cpf === cpf) return res.sendStatus(409);
      }
    }
    res.locals.customersBody = customersBody;
    next();
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}