import bcrypt from "bcryptjs";
import User from "../../Models/UserSchema.js";

const userSignup = async (req, res) => {
  try {
    const { firstname, lastname, emailAddress, password } = req.body;
    if (!firstname || !lastname || !emailAddress || !password) {
      return res.status(401).json({
        status: 401,
        message: "Field Can not be Empty",
        error: true,
      });
    }

    if (
      typeof firstname !== "string" ||
      typeof lastname !== "string" ||
      typeof emailAddress !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        status: 400,
        message: " Enter a Valid Details",
        error: true,
      });
    }

    const findExistingUser = await User.findOne({ emailAddress });
    if (findExistingUser) {
      return res.status(400).json({
        status: 400,
        message: "User Already Exist",
        error: true,
      });
    }

    const Salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, Salt);

    const saveUserData = new User({
      firstname,
      lastname,
      emailAddress,
      password: hashedPassword,
    });

    await saveUserData.save();

    const userData = {
      firstname,
      lastname,
      emailAddress,
    };

    return res.status(201).json({
      status: 201,
      message: "User Created Succesfully",
      error: false,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: true,
    });
  }
};

const Signup = userSignup;

export default Signup;
