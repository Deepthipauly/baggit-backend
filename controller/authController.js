const { register, login, logout,contact } = require("../service/authService");

const registerController = async (req, res, next) => {
  console.log("START: registerController");
  try {
    // req.body -> {name : "jito","email": "jito@gm",mobile : "",password : ""}
    const registeredUser = await register(req.body);
    return res
      .status(201)
      .json({
        data: registeredUser,
        message: "Account Registered.Please login now",
      });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const loginController = async (req, res, next) => {
  console.log("START : logincontroller");
  try {
    const loginData = await login(req.body);
    return res
      .status(201)
      .json({ data: loginData, message: "Login successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const logoutController = async (req, res, next) => {
  console.log("START:logoutController");
  try {
    await logout(req.userId);
    return res.status(201).json({ data: [], message: "Logout successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const contactController= async (req,res,next)=>{

  console.log("START: contactController");

  try {
    const contactedUser = await contact(req.body);
    console.log("saved message details",contactedUser);
    return res.status(201).json({ data: [], message: "Message Send" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }

}


module.exports = { registerController, loginController, logoutController,contactController };
