import db from "../models/index.js";
import Utils from "../utils/index.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, roles, mobileNo } = req.body;
    if (!name || !email || !password || !roles || !mobileNo) {
      return res
        .status(400)
        .json({ message: "name, email, password, roles, mobileNo is required" });
    }
    const existingUser = await db.UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await Utils.Bcrypt.hashedPassword(password);
    const user = await db.UserModel.create({
      name,
      email,
      password: hashPassword,
      roles: roles,
      mobileNo,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.UserModel.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required" });
    }
    const user = await db.UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await Utils.Bcrypt.comparePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const accessToken = Utils.JWT.generateToken({ userId: user._id });
    const refreshToken = Utils.JWT.generateRefreshToken({ userId: user._id });

    await new db.RefreshTokenModel({
      token: refreshToken,
      userId: user._id,
    }).save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: true,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.params.token;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const decode = Utils.JWT.verifyRefreshToken(refreshToken);
    const existingToken = await db.RefreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!existingToken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const newAccessToken = Utils.JWT.generateToken({ userId: decode.userId });
    res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    await db.RefreshTokenModel.findOneAndDelete({ token: refreshToken });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db.UserModel.find();
    if (!users) {
      return res.status(400).json({ message: "Users not found" });
    }
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllToken = async (req, res) => {
  try {
    const tokens = await db.RefreshTokenModel.find();
    if (!tokens) {
      return res.status(400).json({ message: "Tokens not found" });
    }
    res.status(200).json({
      success: true,
      message: "Tokens fetched successfully",
      data: tokens,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const protectedRoute = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Protected route",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const authController = {
  registerUser,
  loginUser,
  getRefreshToken,
  logoutUser,
  getAllUsers,
  getAllToken,
  protectedRoute,
  deleteUser,
};

export default authController;
