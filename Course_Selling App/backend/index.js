import express from "express";
import cookieParser from 'cookie-parser';  
import dotenv from "dotenv";
import cors from 'cors';  
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors({
    origin: process.env.FRONTEND_URL ,  // Allow requests from frontend
    credentials: true,  // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
    
}));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

connectDB();

// Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/admin",adminRoute);

 // Configuration code of cloudinary //
    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
    

// Server
const port = process.env.PORT ;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
