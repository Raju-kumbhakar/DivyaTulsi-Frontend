import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import sendOtpEmail from "../mailer/sendOtpEmail.js";

import bcrypt from "bcryptjs";




const register = async (req, res) => {
  try {
    const { name, email, phone, password, role} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role,
      isVerified: false,
      otp,
      otpExpires,
      otpLastSentAt: new Date(),
    });

    await sendOtpEmail(email, otp);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      email: user.email,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//send OTP function

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otpLastSentAt = new Date();

    await user.save();

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


// verify OTP function

const verifyOtp = async (req, res) => {

  console.log("VERIFY OTP API HIT");
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        message: "OTP not found. Please request a new OTP.",
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpLastSentAt = undefined;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// login function

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
        isVerified: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user._id);

    const refreshToken = generateRefreshToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,

      refreshToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//refresh access token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "User is not verified",
      });
    }

    const newAccessToken =
      generateAccessToken(user._id);

    return res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error(
      "Refresh token error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export {
  register, sendOtp, verifyOtp, login, refreshAccessToken
};