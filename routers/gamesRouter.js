import { Router } from "express";

import { getGames, postGames } from "../controllers/gamesController.js";
import { gamesSchema } from "../middlewares/schemas/gamesSchema.js";


const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", gamesSchema, postGames);

export default gamesRouter;
