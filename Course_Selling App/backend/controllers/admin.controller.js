import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/users.model.js";
import { Admin } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    return res.status(403).json({
        message: "Admin registration is disabled. Contact system administrator."
    });
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (
            email !== process.env.SUPER_ADMIN_EMAIL ||
            password !== process.env.SUPER_ADMIN_PASSWORD
        ) {
            return res.status(403).json({ message: "Invalid admin credentials!" });
        }

        let admin = await Admin.findOne({ email });

        if (!admin) {
            const hashedPassword = await bcrypt.hash(password, 10);

            admin = await Admin.create({
                firstName: "Super",
                lastName: "Admin",
                email,
                password: hashedPassword
            });

            console.log("Super Admin created in DB");
        }

        const token = jwt.sign(
            { adminId: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Admin login successful.",
            token,
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: "admin"
            }
        });

    } catch (error) {
        console.log("Error while admin login", error);
        res.status(500).json({ message: "Error during admin login" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        res.status(200).json({
            message: "Admin logout successful."
        });

    } catch (error) {
        console.log("Error while admin logout", error);
        res.status(500).json({ message: "Error during admin logout" });
    }
};

export const getDashboard = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const totalUsers = await User.countDocuments();
        const pendingPayments = await Purchase.countDocuments({ paymentStatus: "pending" });
        const verifiedPayments = await Purchase.countDocuments({ paymentStatus: "verified" });

        const recentPurchases = await Purchase.find()
            .populate("userId", "firstName lastName email")
            .populate("courseId", "title price")
            .sort({ purchaseDate: -1 })
            .limit(10);

        res.status(200).json({
            stats: {
                totalCourses,
                totalUsers,
                pendingPayments,
                verifiedPayments
            },
            recentPurchases
        });

    } catch (error) {
        console.log("Error fetching dashboard:", error);
        res.status(500).json({
            message: "Error fetching dashboard data",
            error: error.message
        });
    }
};

export const verifyPayment = async (req, res) => {
    const { purchaseId } = req.params;
    const { status } = req.body;

    try {
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) {
            return res.status(404).json({ message: "Purchase not found" });
        }

        purchase.paymentStatus = status;
        await purchase.save();

        res.status(200).json({
            message: `Payment ${status} successfully`,
            purchase
        });

    } catch (error) {
        console.log("Error verifying payment:", error);
        res.status(500).json({ message: "Error verifying payment" });
    }
};