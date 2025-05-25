import mongoose from "mongoose";
import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title field is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: [true, "Author field is required"],
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
      required: [true, "Body field is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", BlogSchema);

export default Blog;
