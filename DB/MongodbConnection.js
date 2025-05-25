import mongoose from "mongoose";
import { DATABASE_URL } from "../Config/config.js";
import logger from "../Utils/Logger.js";
 

export const connectToDatabase = mongoose
  .connect(DATABASE_URL)
  .then(() => logger.info("connected to the database successfully"))
  .catch((err) => logger.info("Database connection failled", err));