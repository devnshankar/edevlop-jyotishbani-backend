import express from "express";
import {
  deleteUser,
  getUser,
  loginUser,
  updateUser,
  verifyUserOtp,
} from "../../controllers/user/user.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.get("/",auth, getUser);
userRouter.post("/login", loginUser)
userRouter.get("/verify", verifyUserOtp)
userRouter.put("/update", auth, updateUser)
userRouter.delete("/delete", auth, deleteUser)


export default userRouter
