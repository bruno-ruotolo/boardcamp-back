import { Router } from "express";

import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { categoriesSchema } from "../middlewares/schemas/categoriesSchema.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", categoriesSchema, postCategories);

export default categoriesRouter;
