import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/users.model.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

/* ================= CREATE COURSE ================= */
export const createCourse = async (req, res) => {
    const adminId = req.adminId; 

    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: "Image is required." });
        }

        const { image } = req.files;

        const allowedFormat = ["image/png", "image/jpeg"];
        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ message: "Only PNG and JPG allowed." });
        }

        const uploadRes = await cloudinary.uploader.upload(image.tempFilePath);

        const course = await Course.create({
            title,
            description,
            price,
            image: {
                public_id: uploadRes.public_id,
                url: uploadRes.secure_url,
            },
            creatorId: adminId, 
        });

        res.status(201).json({
            message: "Course created successfully",
            course,
        });

    } catch (error) {
        console.log("Create Course Error:", error);
        res.status(500).json({ message: "Error creating course" });
    }
};

/* ================= UPDATE COURSE ================= */
export const updateCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const { title, description, price } = req.body;

        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;

        if (req.files && req.files.image) {
            const { image } = req.files;

            const allowedFormat = ["image/png", "image/jpeg"];
            if (!allowedFormat.includes(image.mimetype)) {
                return res.status(400).json({ message: "Only PNG and JPG allowed" });
            }

            if (course.image?.public_id) {
                await cloudinary.uploader.destroy(course.image.public_id);
            }

            const uploadRes = await cloudinary.uploader.upload(image.tempFilePath);

            course.image = {
                public_id: uploadRes.public_id,
                url: uploadRes.secure_url,
            };
        }

        await course.save();

        res.status(200).json({
            message: "Course updated successfully",
            course,
        });

    } catch (error) {
        console.log("Update Course Error:", error);
        res.status(500).json({ message: "Error updating course" });
    }
};

/* ================= DELETE COURSE ================= */
export const deleteCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.image?.public_id) {
            await cloudinary.uploader.destroy(course.image.public_id);
        }

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            message: "Course deleted successfully",
        });

    } catch (error) {
        console.log("Delete Course Error:", error);
        res.status(500).json({ message: "Error deleting course" });
    }
};

/* ================= GET ALL COURSES ================= */
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("creatorId", "firstName email");

        res.status(200).json({
            message: "Courses fetched successfully",
            courses,
        });

    } catch (error) {
        console.log("Get Courses Error:", error);
        res.status(500).json({ message: "Error fetching courses" });
    }
};

/* ================= GET SINGLE COURSE ================= */
export const courseDetails = async (req, res) => {
    const { courseId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const course = await Course.findById(courseId).populate("creatorId", "firstName email");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ course });

    } catch (error) {
        console.log("Course Details Error:", error);
        res.status(500).json({ message: "Error fetching course" });
    }
};

/* ================= BUY COURSE ================= */
export const buyCourses = async (req, res) => {
    const { courseId } = req.params;
    const { transactionId, upiId } = req.body;
    const userId = req.user.userId;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const existingPurchase = await Purchase.findOne({
            userId,
            courseId,
        });

        if (existingPurchase) {
            return res.status(400).json({ message: "Already purchased" });
        }

        if (!transactionId || !upiId) {
            return res.status(400).json({
                message: "Transaction ID and UPI ID required",
            });
        }

        const purchase = await Purchase.create({
            userId,
            courseId,
            transactionId,
            upiId,
            paymentStatus: "pending",
        });

        res.status(200).json({
            message: "Payment submitted. Await admin approval.",
            purchase,
        });

    } catch (error) {
        console.log("Buy Course Error:", error);
        res.status(500).json({ message: "Error purchasing course" });
    }
};