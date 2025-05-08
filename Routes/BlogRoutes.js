import express from "express";
import BlogControllers from "../Controllers/Blogs/BlogControllers.js";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";

const router = express.Router()

router.post('/create', authMiddleware, BlogControllers.createBlog)
router.patch('/publish/:id', authMiddleware, BlogControllers.publishBlog)
router.get('/getBlog/:id', authMiddleware, BlogControllers.getBlogsByUserId)


const blogRoutes = router

export default blogRoutes