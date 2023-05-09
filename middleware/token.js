const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { TokenModel, TOKEN_STATUS } = require("../models/token.model");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.access_token;
    //verify the token with secret key
    const decoded = jwt.verify(token, "superkey123");
    console.log(decoded);
    const userId = decoded.userId;
    req.userId = userId;
    const isTokenExist = await TokenModel.countDocuments({
      user: new mongoose.Types.ObjectId(userId),
      status: TOKEN_STATUS.ACTIVE,
      token,
    });
    if (!isTokenExist) throw new Error("Jwt Token Expired.Pls login now");
    next();
  } catch (e) {
    console.log("error in verify token", e);
    return res
      .status(422)
      .json({ message: e.message || "Authentication Failed" });
  }
};

module.exports = { verifyToken };
