import express from "express";
import { createCourse, updateCourse , deleteCourse, getCourses, courseDetails, buyCourses} from "../controllers/course.controller.js";
const router = express.Router();
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";


router.post('/create',verifyAdmin,createCourse);
router.put('/update/:courseId',verifyAdmin,updateCourse);
router.delete("/delete/:courseId",verifyAdmin,deleteCourse);
router.get("/getcourse",getCourses);
router.get("/:courseID",courseDetails);
router.post("/buy/:courseId",verifyToken,buyCourses);




export default router;