import express from "express";
import { activateController, adminLogin, approveController, deactivateController, deleteController, getAdminMetaData, getAllAdminRequestsController, getAllAdminsController, getPendingAdminRequestsController, rejectController, sendOtpController, verifyOtpController } from "./admin.controller.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { superAdminOnly } from "../../middlewares/superAdmin.middleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/meta",authMiddleware, adminOnly, getAdminMetaData);

// router.post("/send-otp", sendOtpController);
// router.post("/verify-otp", verifyOtpController);

router.post("/approve/:id", authMiddleware, superAdminOnly, approveController);
router.post("/reject/:id", authMiddleware, superAdminOnly, rejectController);

router.patch("/activate/:id", authMiddleware, superAdminOnly, activateController);
router.patch("/deactivate/:id", authMiddleware, superAdminOnly, deactivateController);

router.delete("/:id", authMiddleware, superAdminOnly, deleteController);

// NEW GET APIs
router.get("/all", authMiddleware, superAdminOnly, getAllAdminsController);
router.get("/admin-requests", authMiddleware, superAdminOnly, getAllAdminRequestsController);
router.get("/admin-requests/pending", authMiddleware, superAdminOnly, getPendingAdminRequestsController);
export default router;