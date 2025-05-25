import logger from "../Utils/Logger.js";

const LoggerRequestHandler = (req, res, next) => {
  logger.http(`${req.method} ${req.originalUrl}`);
  next();
};

export default LoggerRequestHandler;
