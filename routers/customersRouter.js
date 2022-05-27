import { Router } from "express";

import {
  getAllCustomers,
  getSingleCustomer,
  postCustomers,
  putCustomers
} from "../controllers/customersController.js";
import { customersSchema } from "../middlewares/schemas/customersSchema.js";

const customersRouter = Router()

customersRouter.get('/customers', getAllCustomers);
customersRouter.get('/customers/:id', getSingleCustomer);
customersRouter.post('/customers/', customersSchema, postCustomers);
customersRouter.put('/customers/:id', customersSchema, putCustomers);

export default customersRouter;