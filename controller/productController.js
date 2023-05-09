const {
  fetchAllProducts,
  fetchProduct,
  addToCart,
  checkOutCart,
  viewOrder,
  viewCart,
  removeProduct,
} = require("../service/productService");

const viewAllProductController = async (req, res, next) => {
  console.log("START: ProductController");
  try {
    const allProductData = await fetchAllProducts();
    return res
      .status(200)
      .json({ data: allProductData, message: "Products fetched successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const viewProductController = async (req, res, next) => {
  console.log("START: viewProductController ");
  try {
    const productData = await fetchProduct(req.params.productId);
    return res
      .status(200)
      .json({ data: productData, message: "Item fetched successfully" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const addToCartController = async (req, res, next) => {
  console.log("START: addToCartController ");
  try {
    const cartData = await addToCart(req.body, req.userId);
    return res
      .status(200)
      .json({ data: cartData, message: "Item added to cart" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const checkOutController = async (req, res, next) => {
  console.log("START: checkOutController ");
  try {
    await checkOutCart(req.userId);
    return res.status(200).json({ data: [], message: "Order Placed" });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const viewOrderController = async (req, res, next) => {
    console.log("START: viewOrderController ");
  try {
    const orderDetails = await viewOrder(req.userId);
    return res
      .status(200)
      .json({
        data: orderDetails,
        message: "Order Details Fetched Successfully",
      });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const viewCartController = async (req, res, next) => {
    console.log("START: viewCartController ");
  try {
    const viewCartDetails = await viewCart(req.userId);
    return res
      .status(200)
      .json({
        data: viewCartDetails,
        message: "Cart Details fetched Successfully",
      });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

const removeProductController = async (req, res, next) => {
    console.log("START: removeProductController ");
  try {
    const removeProductDetails = await removeProduct(
      req.userId,
      req.params.productId
    );
    return res
      .status(200)
      .json({
        data: removeProductDetails,
        message: "Product Removed from Cart Successfully",
      });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

module.exports = {
  viewAllProductController,
  viewProductController,
  addToCartController,
  checkOutController,
  viewOrderController,
  viewCartController,
  removeProductController,
};
