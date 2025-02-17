import jwt from "jsonwebtoken";
import db from "../models/index.js";
const User = db.UserModel;
const auth = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = admin;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication required" });
  }
};

export default auth;
