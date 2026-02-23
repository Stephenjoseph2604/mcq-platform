import express from "express";
import { adminLogin, getAdminMetaData } from "./admin.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/meta",authMiddleware, adminOnly, getAdminMetaData);

export default router;