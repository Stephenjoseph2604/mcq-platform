import express from "express";
import { adminLogin, getAdminMetaData } from "./admin.controller.js";


const router = express.Router();

router.post("/login", adminLogin);
router.get("/meta", getAdminMetaData);

export default router;