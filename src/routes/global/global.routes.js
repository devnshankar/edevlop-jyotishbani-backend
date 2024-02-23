import express from "express";
import { getDailyHoroscope } from "../../controllers/global/global.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const globalRouter = express.Router();

globalRouter.get("/", getDailyHoroscope);


export default globalRouter;



