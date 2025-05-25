import Blog from "../../Models/BlogSchema.js";
import mongoose from "mongoose";
import { estimateReadingTime } from "../../Utils/EstimatedReadingTime.js";
import logger from "../../Utils/Logger.js";

class BlogController {
  // Create a blog
  async createBlog(req, res) {
    try {
      const { title, description, tags, body } = req.body;

      // check if tittle exist before
      const checkForExistingTitle = await Blog.findOne({ title });
      if (checkForExistingTitle) {
        logger.info("Blog already exist");
        return res.status(409).json({
          status: 409,
          message: "Blog already exist",
          error: true,
        });
      }

      // If tittle does not exist create one
      const addBlog = new Blog({
        title,
        description,
        body,
        tags,
        author: req.user.userId,
        reading_time: estimateReadingTime(body),
      });

      await addBlog.save();

      logger.info(`Blog ${addBlog.title} created successfully`);
      res.status(201).json({
        status: 201,
        message: "Blog Created Succefully",
        error: false,
        blog: addBlog,
      });
    } catch (error) {
      logger.error("Error", error);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: true,
      });
    }
  }

  // Get Blog by Blog id

  async getBlogById(req, res) {
    try {
      const { blogId } = req.params;

      const blogs = await Blog.find({ _id: blogId })
        .populate("author", "firstname lastname emailAddress") // user fields
        .sort({ createdAt: -1 });

      logger.info("Blog Fetched Succefully");
      return res.status(200).json({
        status: 200,
        message: "Blog Fetched Succefully",
        error: true,
        blogs,
      });
    } catch (error) {
      logger.error("Error", error);
      return res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }

  // Publish Blog by Blog id
  async publishBlog(req, res) {
    try {
      const { id } = req.params;

      const blog = await Blog.findById(id);

      if (!blog) {
        logger.info("Blog not found");
        return res.status(404).json({ message: "Blog not found" });
      }

      // Ensure both sides are strings
      const blogAuthorId = blog.author?.toString();
      const loggedInUserId = req.user?.userId?.toString();

      if (blogAuthorId !== loggedInUserId) {
        logger.info("Unauthorized");
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (blog.state === "publish") {
        logger.info("Blog already published");
        return res.status(400).json({
          message: "Blog already published",
        });
      }

      blog.state = "publish";
      await blog.save();

      logger.info("Blog published successfully");
      res.json({ message: "Blog published", blog });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }

  //   Get all Blogs by a User
  async getBlogsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const { state, page = 1, limit = 20 } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);

      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        logger.info("Invalid user ID format");
        return res.status(400).json({
          status: 400,
          message: "Invalid user ID format",
          error: true,
        });
      }

      const query = {
        author: userId,
        ...(state && { state }),
      };

      const blogs = await Blog.find(query)
        .populate("author", "firstname lastname emailAddress") // user fields
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const total = await Blog.countDocuments(query);

      return res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        blogs,
      });
    } catch (error) {
      logger.error("Error", error);
      return res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }

  //  Get all Blogs

  async getAllBlogs(req, res) {
    try {
      const { state = "publish", page = 1, limit = 20 } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);

      const query = {
        ...(state && { state }),
      };

      const blogs = await Blog.find(query)
        .populate("author", "firstname lastname emailAddress") // user fields
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const total = await Blog.countDocuments(query);

      return res.status(200).json({
        total,
        page: pageNum,
        limit: limitNum,
        blogs,
      });
    } catch (error) {
      logger.error("Error", error);
      return res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }

  // Delete Blog by Blog id
  async deleteBlog(req, res) {
    try {
      const { blogId } = req.params;

      const blog = await Blog.findById({ _id: blogId });

      if (!blog) {
        logger.info("Blog not found");
        return res.status(404).json({ message: "Blog not found" });
      }

      // Ensure both sides are strings
      const blogAuthorId = blog.author?.toString();
      const loggedInUserId = req.user?.userId?.toString();

      if (blogAuthorId !== loggedInUserId) {
        logger.info("Unauthorized");
        return res.status(403).json({ message: "Unauthorized" });
      }

      await Blog.findByIdAndDelete(blogId);

      logger.info("Blog deleted successfully");
      res.status(200).json({
        status: 200,
        message: "Blog Deleted Succefully",
        error: false,
      });
    } catch (error) {
      logger.error("Error", error);
      res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }
}

export default new BlogController();
