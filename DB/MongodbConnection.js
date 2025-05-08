import mongoose from "mongoose";
import { DATABASE_URL } from "../Config/config.js";
 

export const connectToDatabase = mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("connected to the database successfully"))
  .catch((err) => console.log("Database connection failled", err));