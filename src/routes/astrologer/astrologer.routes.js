import express from "express";
import {
  getAstrologer,
  loginAstrologer,
  verifyAstrologerOtp,
  updateAstrologer,
  deleteAstrologer,
} from "../../controllers/astrologer/astrologer.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const astrologerRouter = express.Router();

astrologerRouter.get("/",auth, getAstrologer);
astrologerRouter.post("/login", loginAstrologer);
astrologerRouter.get("/verify", verifyAstrologerOtp);
astrologerRouter.put("/update", auth, updateAstrologer);
astrologerRouter.delete("/delete", auth, deleteAstrologer);

export default astrologerRouter;
