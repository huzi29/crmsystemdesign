import jwt from "jsonwebtoken";
import db from "../models/index.js";
const verifyUser = async (req, res, next) => {
  
  const token = req.headers["x-access-token"];
  
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token" });
      }

      req.id = decoded.userId;

      const user = await db.UserModel.findOne({
        _id: req.id,
      });
      req.user = user;
      req.token = token;
      next();
    });
  } else {
    return res.status(401).json({ message: "No Token Found" });
  }
};

export default verifyUser;
