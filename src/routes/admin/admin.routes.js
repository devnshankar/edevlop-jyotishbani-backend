import express from "express";
import { getAdmin, loginAdmin } from "../../controllers/admin/admin.controllers.js";

const adminRouter = express.Router();

adminRouter.get("/", getAdmin);
adminRouter.post("/login", loginAdmin);

export default adminRouter;
