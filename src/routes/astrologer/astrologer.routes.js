import express from "express";
import { getAstrologer, loginAstrologer } from "../../controllers/astrologer/astrologer.controllers.js";

const astrologerRouter = express.Router();

astrologerRouter.get("/", getAstrologer);
astrologerRouter.post("/login", loginAstrologer);

export default astrologerRouter;
