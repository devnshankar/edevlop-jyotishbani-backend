import express from "express";
import {
  getAdmin,
  loginAdmin,
  verifyAdminOtp,
  updateAdmin,
  deleteAdmin,
} from "../../controllers/admin/admin.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const adminRouter = express.Router();
adminRouter.get("/", getAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/verify", verifyAdminOtp);
adminRouter.put("/update", auth, updateAdmin);
adminRouter.delete("/delete", auth, deleteAdmin);

export default adminRouter;
