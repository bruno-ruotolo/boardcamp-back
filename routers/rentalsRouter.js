import { Router } from "express";

import {
  deleteRental,
  getRentals,
  postRentals,
  postReturnRental
} from "../controllers/rentalsController.js";
import { rentalsSchema } from "../middlewares/schemas/rentalsSchema.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", rentalsSchema, postRentals);
rentalsRouter.post("/rentals/:id/return", postReturnRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;