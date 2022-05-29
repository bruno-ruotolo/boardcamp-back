import chalk from "chalk";

import db from "../db.js";

export async function getAllCustomers(req, res) {
  let { cpf } = req.query;
  const { offset, limit, order, desc } = req.query;
  if (!cpf) cpf = '';

  try {
    const result = await db.query(
      `SELECT * FROM customers 
      WHERE cpf LIKE '${cpf}%'
      ORDER BY ${order ? (desc === "true" ? order + " desc" : order) : false} 
      LIMIT ${limit ? limit : null}
      OFFSET ${offset ? offset : null}`)
    res.status(200).send(result.rows)
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function getSingleCustomer(req, res) {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM customers WHERE id=${id}`);

    if (!result.rows[0]) return res.sendStatus(404);
    res.status(200).send(result.rows[0]);
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function postCustomers(req, res) {
  const { customersBody } = res.locals;
  const { name, phone, cpf, birthday } = customersBody;

  try {
    await db.query(
      `INSERT INTO customers (name, phone, cpf, birthday)
      VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);

    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}

export async function putCustomers(req, res) {
  const { id } = req.params;
  const { customersBody } = res.locals;
  const { name, phone, cpf, birthday } = customersBody;

  try {
    await db.query(
      `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4
      WHERE id=$5`, [name, phone, cpf, birthday, id]);

    res.sendStatus(201);
  } catch (e) {
    console.log(chalk.red.bold(e));
    res.sendStatus(500);
  }
}