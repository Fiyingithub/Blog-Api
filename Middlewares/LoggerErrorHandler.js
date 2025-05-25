
import logger from "../Utils/Logger.js";

const LoggerErrorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: 'Something went wrong' });
};

export default LoggerErrorHandler;
