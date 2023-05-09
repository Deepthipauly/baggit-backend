//to hash password we use bcrypt
//hash cheyan use akunath salt
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { TokenModel, TOKEN_STATUS } = require("../models/token.model");
const { isEmail } =require("../helper/validator");
const ContactModel = require ("../models/contact.model")

// register

const register = async (userData) => {
  // destructuring
  const { name, email, password, mobile } = userData;
  // validation
  if (!name) throw new Error("name is required");
  if (!email) throw new Error("email is required");
  if(!isEmail(email)) throw new Error ("invalid email");
  if (!password) throw new Error("password is required");
  if (!mobile) throw new Error("mobile number is required");
  // checking email in db
  const isEmailExist = await UserModel.countDocuments({ email });
  if (isEmailExist) throw new Error("email already exists");
  const isMobileExist = await UserModel.countDocuments({ mobile });
  if (isMobileExist) throw new Error("mobile already exists");
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = await UserModel.create({
    name,
    email,
    mobile,
    password: hashedPassword,
  });
  return {
    email,
    name,
    userId: newUser._id,
  };
};

//async used to control asymchronous data like promise

const login = async (loginData) => {
  const { email, password } = loginData;
  if (!email) throw new Error("email is required");
  if(!isEmail(email)) throw new Error ("invalid email");

  if (!password) throw new Error("password is required");
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("user not registered");
  //to compare hashed password with user entered password
  const isPasswordVerified = await bcrypt.compare(password, user.password);
  if (!isPasswordVerified) throw new Error("incorrect password");
  //token generate when login
  const token = jwt.sign({ userId: user._id }, "superkey123");
  const storedTokenDetails = await TokenModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(user._id) },
    {
      token,
      status: TOKEN_STATUS.ACTIVE,
      user: new mongoose.Types.ObjectId(user._id),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("storedTokenDetails", storedTokenDetails);
  return {
    token,
    userId: user._id,
    email: user.email,
    name: user.name,
  };
};

const logout = async (userId) => {
  const isTokenExist = await TokenModel.countDocuments({
    user: new mongoose.Types.ObjectId(userId),
    status: TOKEN_STATUS.ACTIVE,
  });
  if (!isTokenExist) throw new Error("Jwt Token Expired.Pls login now");
  const storedTokenDetails = await TokenModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(userId) },
    {
      status: TOKEN_STATUS.DELETED,
      user: new mongoose.Types.ObjectId(userId),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("storedTokenDetails", storedTokenDetails);
  return true;
};

const contact = async(contactData)=>{
const{ name,email,message } = contactData;
if (!name) throw new Error("name is required");
if (!email) throw new Error("email is required");
if (!message) throw new Error("message is required");
if(!isEmail(email)) throw new Error ("invalid email");
return ContactModel.create({email,name,message});
}



module.exports = { register, login, logout, contact };
