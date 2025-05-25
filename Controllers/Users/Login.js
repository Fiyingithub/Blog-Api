import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../Models/UserSchema.js";
import { JWT_SECRET } from "../../Config/config.js";
import logger from "../../Utils/Logger.js";

const userLogin = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    if (!emailAddress || !password) {
      return res.status(401).json({
        status: 401,
        message: "Field Cannot be Empty",
        error: true,
      });
    }

    const findExistingUser = await User.findOne({ emailAddress });
    if (!findExistingUser) {
      logger.info("User does not exist");
      return res.status(400).json({
        status: 400,
        message: "User does not Exist",
        error: true,
      });
    }

    const isPasswordValid = bcrypt.compare(password, findExistingUser.password);
    if (!isPasswordValid) {
      logger.info("Password does not match");
      return res.status(400).json({
        status: 400,
        message: "Invalid Email or Password",
        error: true,
      });
    }

    const generateToken = jwt.sign(
      {
        userId: findExistingUser._id,
        emailAddress: findExistingUser.emailAddress,
      },
      JWT_SECRET,
      {
        expiresIn: "1hr",
      }
    );

    const userDto = {
      firstname: findExistingUser.firstname,
      lastname: findExistingUser.lastname,
      emailAddress: findExistingUser.emailAddress,
    };

    logger.info(`User ${userDto.firstname} logged in successfully`);
    return res.status(200).json({
      statu: 200,
      message: " User Login Successfull",
      error: false,
      token: generateToken,
      user: userDto,
    });
  } catch (error) {
    logger.error("Error", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: true,
    });
  }
};

const Login = userLogin;

export default Login;
