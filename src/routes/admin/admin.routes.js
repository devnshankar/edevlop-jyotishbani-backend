import express from "express";
import {
  getAdmin,
  loginAdmin,
  verifyAdminOtp,
  updateAdmin,
  deleteAdmin,
  adminAccessTokenProvider,
} from "../../controllers/admin/admin.controllers.js";
import auth from "../../middlewares/auth.middlewares.js";

const adminRouter = express.Router();
adminRouter.get("/",auth,  getAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/verify", verifyAdminOtp);
adminRouter.put("/update", auth, updateAdmin);
adminRouter.delete("/delete", auth, deleteAdmin);
adminRouter.delete("/access", adminAccessTokenProvider);

export default adminRouter;
