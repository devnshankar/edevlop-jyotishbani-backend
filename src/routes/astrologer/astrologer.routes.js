import express from "express";
import {
  getAstrologer,
  loginAstrologer,
  verifyAstrologerOtp,
} from "../../controllers/astrologer/astrologer.controllers.js";

const astrologerRouter = express.Router();

astrologerRouter.get("/", getAstrologer);
astrologerRouter.post("/login", loginAstrologer);
astrologerRouter.get("/verify", verifyAstrologerOtp);

export default astrologerRouter;
