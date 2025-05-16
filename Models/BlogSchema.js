import mongoose from "mongoose";
import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BlogSchema = new Schema(
  {
    blog_Id: {
        type: String,
        unique: true,
        default: uuidv4
    },
    title: {
      type: String,
      require: [true, "Title field is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    author: {
      type: String,
      ref: "user",
      require: [true, "Author field is required"],
    },
    state: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: String,
    tags: {
      type: String,
    },
    body: {
      type: String,
      require: [true, "Body field is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", BlogSchema);

export default Blog;
