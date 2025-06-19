// swagger/swaggerConfig.js
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Blogging API",
      version: "1.0.0",
      description: "API documentation for the Blogging platform",
      contact: {
        name: "Adekoya Adegbenga",
      },
    },
    servers: [
      {
        url: "http://localhost:4219/api",
        description: "Development server",
      },
      {
        url: "https://blog-api-z6ao.onrender.com/api",
        description: "Production server",
      },
    ],
    schemes: {
      http: "http",
      https: "https",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
              example: "66533cab894ff9a5cc9e0bcf",
            },
            firstname: {
              type: "string",
              example: "John",
            },
            lastname: {
              type: "string",
              example: "Doe",
            },
            emailAddress: {
              type: "string",
              format: "email",
              example: "john.doe@email.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password123!",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["firstname", "lastname", "emailAddress", "password"],
        },
        Blog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Blog ID",
              example: "66533cab894ff9a5cc9e0bcf",
            },
            title: {
              type: "string",
              example: "How to Build a REST API with Node.js",
            },
            body: {
              type: "string",
              example:
                "This blog covers how to build a RESTful API using Express and MongoDB.",
            },
            description: {
              type: "string",
              example: "A comprehensive guide to building REST APIs.",
            },
            state: {
              type: "string",
              enum: ["draft", "published"],
              default: "draft",
            },
            author: {
              type: "string",
              description: "Author's user ID",
              example: "66533cab894ff9a5cc9e0bcf",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["title", "body"],
        },
        CreateBlogInput: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "The blog post title",
              example: "My First Blog Post",
            },
            body: {
              type: "string",
              description: "The blog post content",
              example: "This is the content of my blog post...",
            },
            state: {
              type: "string",
              enum: ["draft", "published"],
              default: "draft",
              description: "Publication state of the blog",
            },
          },
          required: ["title", "body"],
        },
        BlogListResponse: {
          type: "object",
          properties: {
            blogs: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Blog",
              },
            },
            totalCount: {
              type: "integer",
              description: "Total number of blogs",
              example: 25,
            },
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            pageSize: {
              type: "integer",
              description: "Number of items per page",
              example: 10,
            },
          },
        },
        LoginRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john.doe@email.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password123!",
            },
          },
          required: ["email", "password"],
        },
        LoginResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              description: "JWT access token",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "integer",
              example: 400,
            },
            error: {
              type: "string",
              example: "Invalid request payload",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Unauthorized",
                  },
                  message: {
                    type: "string",
                    example: "Authentication required to access this resource",
                  },
                  code: {
                    type: "integer",
                    example: 401,
                  },
                },
              },
            },
          },
        },
        ForbiddenError: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Forbidden",
                  },
                  message: {
                    type: "string",
                    example: "You don't have permission to perform this action",
                  },
                  code: {
                    type: "integer",
                    example: 403,
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Not Found",
                  },
                  message: {
                    type: "string",
                    example: "The requested resource was not found",
                  },
                  code: {
                    type: "integer",
                    example: 404,
                  },
                },
              },
            },
          },
        },
        ConflictError: {
          description: "Resource conflict",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Conflict",
                  },
                  message: {
                    type: "string",
                    example: "Resource already exists or conflicts with existing data",
                  },
                  code: {
                    type: "integer",
                    example: 409,
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Internal Server Error",
                  },
                  message: {
                    type: "string",
                    example: "An unexpected error occurred on the server",
                  },
                  code: {
                    type: "integer",
                    example: 500,
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Routes/BlogRoutes.js", "./Routes/UserRoutes.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;