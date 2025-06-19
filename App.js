import express from "express";
import { PORT } from "./Config/config.js";
import { connectToDatabase } from "./DB/MongodbConnection.js";
import Routes from "./Routes/index.js";
import cors from "cors";
import logger from "./Utils/Logger.js";
import LoggerErrorHandler from "./Middlewares/LoggerErrorHandler.js";
import LoggerRequestHandler from "./Middlewares/LoggerRequestHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Swagger/Swagger.js"; // adjust path as needed
import helmet from 'helmet'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// CORS
const corsOptions = {
  origin: ["*", "http://localhost:4219", "https://blog-api-z6ao.onrender.com/api"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(LoggerErrorHandler);
app.use(LoggerRequestHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
// DATABASE CONNECTION
connectToDatabase;

app.use("/api", Routes);

app.listen(PORT, () => {
  // console.log(`Server connected on https://localhost:${PORT}`);
  logger.info(`Server is running on http://localhost:${PORT}`);
});

export default app;
