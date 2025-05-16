import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../Models/UserSchema.js";
import { JWT_SECRET } from "../../Config/config.js";

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
      return res.status(400).json({
        status: 400,
        message: "User Already Exist",
        error: true,
      });
    }

    const isPasswordValid = bcrypt.compare(password, findExistingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        message: "Password does not match with existing Account",
        error: true,
      });
    }

    const generateToken = jwt.sign(
      {
        userId: findExistingUser.userId,
        emailAddress: findExistingUser.emailAddress,
      },
      JWT_SECRET
      ,
      {
        expiresIn: "3days",
      }
    );

    const userDto = {
        firstname: findExistingUser.firstname,
        lastname: findExistingUser.lastname,
        emailAddress: findExistingUser.emailAddress
    }

    return res.status(200).json({
        statu: 200,
        message: " User Login Successfull",
        error: false,
        token: generateToken,
        user: userDto
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: true,
    });
  }
};

const Login = userLogin

export default Login 
