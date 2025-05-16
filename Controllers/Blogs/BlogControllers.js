import Blog from "../../Models/BlogSchema.js";
import mongoose from "mongoose";
import { estimateReadingTime } from "../../Utils/EstimatedReadingTime.js";

class BlogController {
  // Create a blog
  async createBlog(req, res) {
    try {
      const { title, description, tags, body } = req.body;
      // check if body include title and body
      if (!title || !body) {
        res.status(401).json({
          status: 401,
          message: "Field can not be empty",
          error: true,
        });
      }

      // check if tittle exist before
      const checkForExistingTitle = await Blog.findOne({ title });
      if (checkForExistingTitle) {
        return res.status(400).json({
          status: 400,
          message: "Title already exist",
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

      res.status(201).json({
        status: 201,
        message: "Blog Created Succefully",
        error: false,
        blog: addBlog,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: true,
      });
    }
  }

  // Publish Blog by Blog id
  async publishBlog(req, res) {
    try {
      const { id } = req.params;

      const blog = await Blog.findOne({ blog_Id: id });

      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      // Ensure both sides are strings
      const blogAuthorId = blog.author?.toString();
      const loggedInUserId = req.user?.userId?.toString();

      if (blogAuthorId !== loggedInUserId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      blog.state = "publish";
      await blog.save();

      res.json({ message: "Blog published", blog });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
        error: true,
        details: error.message,
      });
    }
  }

  //   Get all Blogs by a User
  // async getBlogsByUserId(req, res) {
  //   try {
  //     console.log(req.params);
  //     const { state, page = 1, limit = 20 } = req.query;
  //     const pageNum = Number(page);
  //     const limitNum = Number(limit);
  //     const { userId } = req.params;

  //     const query = {
  //       author: userId,
  //       ...(state && { state }), // only add state if it's provided
  //     };

  //     console.log("QUERY:", query);

  //     const blogs = await Blog.find(query)
  //       .populate("author", "firstname lastname emailAddress")
  //       .skip((pageNum - 1) * limitNum)
  //       .limit(limitNum)
  //       .sort({ createdAt: -1 });

  //     const total = await Blog.countDocuments(query);

  //     console.log("BLOGS:", blogs);

  //     res.status(200).json({
  //       total,
  //       page: pageNum,
  //       limit: limitNum,
  //       blogs,
  //     });
  //   } catch (error) {
  //     console.log(error)
  //     res.status(500).json({
  //       status: 500,
  //       message: "Server error",
  //       error: true,
  //       details: error.message,
  //     });
  //   }
  // }


async getBlogsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const { state, page = 1, limit = 20 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: true,
      details: error.message,
    });
  }
}

}

export default new BlogController();
