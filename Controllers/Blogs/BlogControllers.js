import Blog from "../../Models/BlogSchema.js";
import { estimateReadingTime } from "../../Utils/EstimatedReadingTime.js";

class BlogController {
  // Create a blog
  async createBlog(req, res) {
    try {
      const { title, description, tags, body } = req.body;
      if (!title || !body) {
        res.status(401).json({
          status: 401,
          message: "Field can not be empty",
          error: true,
        });
      }

      const checkForExistingTitle = await Blog.findOne({ title });
      if (checkForExistingTitle) {
        return res.status(400).json({
          status: 400,
          message: "Title already exist",
          error: true,
        });
      }

      const addBlog = new Blog({
        title,
        description,
        body,
        tags,
        author: req.user._id,
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

  // Publish Blog

  async publishBlog(req, res) {
    try {
      const blog_Id = req.params.id;
      if (!blog_Id) {
        return res.status(404).json({
          status: 404,
          message: "Blog Id is required",
          error: false,
        });
      }

      const blog = await Blog.findOne({ blog_Id });

      if (!blog) {
        return res.status(404).json({
          status: 404,
          message: "Blog does not exist",
          error: false,
        });
      }

      if (blog.state === "publish") {
        return res.status(400).json({
          status: 400,
          message: "Blog Already Published",
          error: false,
        });
      }

      blog.state = "publish";
      await blog.save();

      return res.status(200).json({
        status: 200,
        message: "Blog Published Successfully",
        error: false,
        blog,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: true,
        details: error.message,
      });
    }
  }

  //   Get all Blogs by a User and also
  async getBlogsByUserId(req, res) {
    try {
        const { state , page = 1, limit = 20 } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);

        const query = {
          author: req.user._id,
        //   ...(state && { state }),
        };

        if(state){
            query.state = state
        }

        const blogs = await Blog.find(query)
          .populate("author", "firstname lastname emailAddress")
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .sort({ createdAt: -1 });

        const total = await Blog.countDocuments(query);

        res.status(200).json({
          total,
          page: pageNum,
          limit: limitNum,
          blogs,
        });

    //   const { state } = req.query;
    //   const query = { author: req.user._id };
    //   console.log(query)

    //   if (state) {
    //     query.state = state;
    //   }

    //   const blogs = await Blog.find(query).sort({ createdAt: -1 });

    //   res.status(200).json({
    //     status: "success",
    //     results: blogs.length,
    //     data: {
    //       blogs,
    //     },
    //   });
    } catch (error) {
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
