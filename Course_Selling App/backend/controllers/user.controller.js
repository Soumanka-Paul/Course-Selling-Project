import { User } from "../models/users.model.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";
import mongoose  from "mongoose";
 
export const signup = async (req, res) => {
    // Zod schema inside the function
    const userSchema = z.object({
        firstName: z.string().min(2, { message: "Enter more than 2 characters" }).max(50),
        lastName: z.string().min(2, { message: "Enter more than 2 characters" }).max(50),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(8, { message: "Enter the password more than 8 characters" }).max(255),
    });
    
    // Validate data
    const validatedData = userSchema.safeParse(req.body);
    
   if (!validatedData.success) {
    return res.status(400).json({
        message: validatedData.error.issues.map(err => err.message)
    });
}
    
    const { firstName, lastName, email, password } = validatedData.data;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email."
            });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        
         // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email },  // Payload (data to store in token)
            process.env.JWT_SECRET,  // Secret key
            { expiresIn: process.env.JWT_EXPIRES_IN }  // Token expires in 7 days
        );
        
         res.status(201).json({
            message: "User created successfully.",
            token,  // Send token to client
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error during signup"
        });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email: email });
        
        // Check if user exists
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials!" });
        }
        
        // Compare password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        // Check if password is correct
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "Invalid credentials!" });
        }
        
        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        // Set cookie with security options
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });
        
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
        
    } catch (error) {
        console.log("Error while login", error);
        res.status(500).json({ message: "Error during login" });
    }
};
// Backend (already correct)
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
        
        res.status(200).json({
            message: "Logout successful."
        });
        
    } catch (error) {
        console.log("Error while logout", error);
        res.status(500).json({ message: "Error during logout" });
    }
};
export const purchasedCourse = async (req, res) => {
    const userId = req.user.userId;
    
    try {
        // Find ALL purchases
        const purchased = await Purchase.find({ userId });
        
        // Check if user has purchased anything
        if (!purchased || purchased.length === 0) {
            return res.status(200).json({
                message: "You haven't purchased any courses yet.",
                purchased: [],
                courseData: []
            });
        }
        
        // Extract course IDs
        let purchasedCourseIds = [];
        for (let i = 0; i < purchased.length; i++) {
            purchasedCourseIds.push(purchased[i].courseId);
        }
        
        // Get course details
        const courseData = await Course.find({
            _id: { $in: purchasedCourseIds }
        });
        
        
        
        res.status(200).json({
            message: "Purchased courses fetched successfully.",
            purchased,
            courseData
        });
        
    } catch (error) {
        console.log("Error while fetching purchase details:", error);
        res.status(500).json({
            message: "Cannot fetch the purchased data and course details",
            error: error.message
        });
    }
};