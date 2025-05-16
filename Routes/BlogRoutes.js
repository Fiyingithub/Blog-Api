import express from "express";
import BlogControllers from "../Controllers/Blogs/BlogControllers.js";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router()

// Create blog (Authenticated User Only)
router.post('/create', authMiddleware, BlogControllers.createBlog)

// Publish blog  (Authenticated User Only)
router.patch('/:blog_Id/publish', authMiddleware, BlogControllers.publishBlog)

// Get blog by userId (Authenticated User Only)
router.get('/:userId', authMiddleware, BlogControllers.getBlogsByUserId)


const blogRoutes = router

export default blogRoutes