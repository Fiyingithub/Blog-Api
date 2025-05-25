import express from "express";
import BlogControllers from "../Controllers/Blogs/BlogControllers.js";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";
import { createBlogValidator } from "../Middlewares/Validate.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /blog/create:
 *   post:
 *     summary: Create a new blog
 *     description: Creates a new blog post in draft state. User must be authenticated.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogInput'
 *           examples:
 *             blogExample:
 *               summary: Sample blog creation
 *               value:
 *                 title: "string"
 *                 body: "string"
 *                 tags: ["string"]
 *                 description: "string"
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Blog Created Successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 message:
 *                   type: string
 *                   example: "Title and body are required"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/create",
  createBlogValidator,
  authMiddleware,
  BlogControllers.createBlog
);

/**
 * @swagger
 * /blog/publish/{id}:
 *   patch:
 *     summary: Publish a blog
 *     description: Changes a blog's state from draft to published. Only the blog author can publish their own blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID to publish
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [published]
 *                 example: "publish"
 *                 description: The state to update the blog to
 *             required:
 *               - state
 *           examples:
 *             publishBlog:
 *               summary: Publish a blog
 *               value:
 *                 state: "published"
 *     responses:
 *       200:
 *         description: Blog published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Blog published successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Blog already published or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Blog is already published"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.patch("/publish/:id", authMiddleware, BlogControllers.publishBlog);

/**
 * @swagger
 * /blog/{userId}:
 *   get:
 *     summary: Get all blogs for a specific user
 *     description: Retrieves all blogs created by a specific user with pagination and filtering options.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get blogs for
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter blogs by state
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of blogs per page
 *     responses:
 *       200:
 *         description: List of user's blogs with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Blogs fetched successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   $ref: '#/components/schemas/BlogListResponse'
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: "Invalid user ID format"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/:userId", authMiddleware, BlogControllers.getBlogsByUserId);

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all published blogs
 *     description: Retrieves all published blogs with pagination. Public endpoint that doesn't require authentication.
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [draft, publish]
 *           default: publish
 *         description: Filter blogs by state (default is publish)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of blogs per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search blogs by title or content
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title]
 *           default: createdAt
 *         description: Sort blogs by field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of blogs with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Blogs fetched successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   $ref: '#/components/schemas/BlogListResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/", BlogControllers.getAllBlogs);

/**
 * @swagger
 * /blog/blogId/{blogId}:
 *   get:
 *     summary: Get a single blog by ID
 *     description: Retrieves a specific blog post by its ID. Public endpoint for published blogs.
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID to retrieve
 *     responses:
 *       200:
 *         description: Blog details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Blog fetched successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get("/blogId/:blogId", BlogControllers.getBlogById);

/**
 * @swagger
 * /blog/{blogId}:
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Permanently deletes a blog post. Only the blog author can delete their own blog.
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Blog deleted successfully"
 *                 error:
 *                   type: boolean
 *                   example: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete("/:blogId", authMiddleware, BlogControllers.deleteBlog);

const blogRoutes = router;
export default blogRoutes;
