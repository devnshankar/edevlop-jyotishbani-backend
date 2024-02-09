import express from "express";
import { getUser, loginUser, verifyOtp } from "../../controllers/user/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/", getUser);
userRouter.post("/login", loginUser)
userRouter.post("/verify", verifyOtp)


export default userRouter
