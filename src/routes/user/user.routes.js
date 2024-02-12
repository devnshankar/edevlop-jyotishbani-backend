import express from "express";
import {
  getUser,
  loginUser,
  verifyUserOtp,
} from "../../controllers/user/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/login", loginUser)
userRouter.get("/verify", verifyUserOtp)


export default userRouter
