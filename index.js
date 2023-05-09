// import express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { verifyToken } = require("./middleware/token");
const {
  registerController,
  loginController,
  logoutController,
  contactController
} = require("./controller/authController");
const {
  viewAllProductController,
  viewProductController,
  addToCartController,
  checkOutController,
  viewOrderController,
  viewCartController,
  removeProductController,
} = require("./controller/productController");

//app creation
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", registerController);

app.post("/login", loginController);

app.get("/all_products", viewAllProductController);

app.get("/view_product/:productId", viewProductController);

app.post("/contact",contactController);

app.use(verifyToken);

// authorized route
app.post("/add_cart", addToCartController);

app.post("/check_out", checkOutController);

app.get("/view_order", viewOrderController);

app.get("/view_cart", viewCartController);

app.delete("/remove_product/:productId", removeProductController);

app.post("/logout", logoutController);

//port setting
app.listen(3000, () => {
  console.log("server started at port 3000");
  mongoose.connect("mongodb://127.0.0.1:27017/baggit", {
    useNewUrlParser: true,
  });
});
