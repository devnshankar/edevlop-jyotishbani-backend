import express from "express";
import {
  getAstrologer,
  loginAstrologer,
  verifyAstrologerOtp,
  updateAstrologer,
  deleteAstrologer,
  astrologerAccessTokenProvider,
} from "../../controllers/astrologer/astrologer.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const astrologerRouter = express.Router();

astrologerRouter.get("/",auth, getAstrologer);
astrologerRouter.post("/login", loginAstrologer);
astrologerRouter.post("/verify", verifyAstrologerOtp);
astrologerRouter.put("/update", auth, updateAstrologer);
astrologerRouter.delete("/delete", auth, deleteAstrologer);
astrologerRouter.delete("/access", astrologerAccessTokenProvider);

export default astrologerRouter;
