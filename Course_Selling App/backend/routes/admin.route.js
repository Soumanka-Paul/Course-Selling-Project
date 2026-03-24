import express from "express";
import { signup, login, logout,getDashboard, verifyPayment } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";

const router = express.Router();

// Public routes

router.post("/login", login);
router.post("/logout", logout);
router.get("/dashboard", verifyAdmin, getDashboard);
router.put("/verify-payment/:purchaseId", verifyAdmin, verifyPayment);
// Test route to verify token
// router.get("/test-token", verifyAdmin, (req, res) => {
//     res.json({
//         message: "Token is valid!",
//         admin: req.admin
//     });
// });

// Protected admin dashboard (example)
// router.get("/dashboard", verifyAdmin, (req, res) => {
//     res.json({
//         message: "Welcome to admin dashboard",
//         admin: req.admin
//     });
// });

export default router;