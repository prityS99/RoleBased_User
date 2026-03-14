const User = require("../models/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserValidation } = require("../utils/joiValidations");

class AuthController {
  // REGISTER //

  async register(req, res) {
    try {
      const { error, value } = UserValidation.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }

      const { name, email, password, role } = value;

      // check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userdata = new User({
        name,
        email,
        password: hashPassword,
        role: role || "user",
      });

      const data = await userdata.save();

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // LOGIN //

 async login(req, res) {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password does not match"
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is missing in .env file");
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
});

  } catch (error) {

    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });

  }
}

  // GET USERS //

  async getUsers(req, res) {
    try {
      const data = await User.find();
      console.log("Usersfetched : ", data.length);

      return res.status(201).json({
        success: true,
        message: "Users List",
        total: data.length,
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DASHBOARD //

  async dashboard(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Welcome to user dashboard",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

    async adminDashboard(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Welcome to Admin dashboard",
        data: req.user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

}

module.exports = new AuthController();


