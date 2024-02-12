import express from "express";
import { getAdmin, loginAdmin, verifyAdminOtp } from "../../controllers/admin/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/", getAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/verify", verifyAdminOtp);

export default adminRouter;
