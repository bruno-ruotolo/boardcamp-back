import { Router } from "express";

import { getRentals, postRentals } from "../controllers/rentalsController.js";
import { rentalsSchema } from "../middlewares/schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", rentalsSchema, postRentals);

export default rentalsRouter;