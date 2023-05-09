const mongoose = require("mongoose");
const { ProductModel } = require("../models/product.model");
const { OrderModel, ORDER_TYPE } = require("../models/order.model");

const fetchAllProducts = async () => {
  const allProductData = await ProductModel.find({},{ __v : 0 });
  console.log("allProductData:", allProductData);
  return allProductData;
};

const fetchProduct = async (productId) => {
  // check for valid _id
  const productData = await ProductModel.findById(productId, { __v: 0 });
  console.log("singleProduct", productData);
  return productData;
};

const addToCart = async (cartData, userId) => {
  //destructuring the object
  const { productId, quantity } = cartData;
  let cartProductDetails;
  if (!productId) throw new Error("ProductId is required");
  if (!quantity) throw new Error("Please select the quantity");
  const isValidProductId = mongoose.isValidObjectId(productId);
  if (!isValidProductId) throw new Error("productId is Invalid");
  const userOrderDetails = await OrderModel.findOne({
    user: userId,
    status: ORDER_TYPE.INCART,
  });

  if (!userOrderDetails) {
    cartProductDetails = await OrderModel.create({
      user: new mongoose.Types.ObjectId(userId),
      products: [
        {
          id: new mongoose.Types.ObjectId(productId),
          quantity,
        },
      ],
      status: ORDER_TYPE.INCART,
    });
    return cartProductDetails;
  }
  const { products } = userOrderDetails;
  for (const product of products) {
    if (String(product.id) === productId) {
      const updateQuantity = product.quantity + quantity;
      cartProductDetails = await OrderModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userOrderDetails._id) },
        { $set: { "products.$[item].quantity": updateQuantity } },
        {
          arrayFilters: [
            {
              "item.id": {
                $eq: productId,
              },
            },
          ],
          returnOriginal: false,
        }
      );
      break;
    }
  }

  if (!products.find((el) => String(el.id) === productId)) {
    cartProductDetails = await OrderModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(userOrderDetails._id) },
      {
        $push: {
          products: {
            id: new mongoose.Types.ObjectId(productId),
            quantity: quantity,
          },
        },
      },
      { returnOriginal: false }
    );
  }

  return cartProductDetails;
};

const checkOutCart = async (userId) => {
  console.log("user",userId);
  const userOrderDetails = await OrderModel.findOne({
    user: userId,
    status: ORDER_TYPE.INCART,
  });
  console.log("userOrderDetails",userOrderDetails);
  if (!userOrderDetails) throw new Error("Your Cart is Empty");
  await OrderModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(userId),
    _id: new mongoose.Types.ObjectId(userOrderDetails._id)
    },
    { status: ORDER_TYPE.ORDERED }
  );
};

const viewOrder = async (userId) => {
  const userOrderDetails = await OrderModel.find(
    {
      user: new mongoose.Types.ObjectId(userId),
      status: ORDER_TYPE.ORDERED,
    },
    {
      products: 1,
      updatedAt: 1
    }
  ).populate({
    path: "products.id",
    select:
      "-isAvailable -reviewCount -warranty -dimensions -isNewArrival -user",
  });
  if (!userOrderDetails) throw new Error("You haven't ordered anything");
  return userOrderDetails;
};

const viewCart = async (userId) => {
  const viewCartDetails = await OrderModel.findOne({
    user: new mongoose.Types.ObjectId(userId),
    status: ORDER_TYPE.INCART,
  })
    .populate({
      path: "products.id",
      select: "-isAvailable -reviewCount -warranty -dimensions -isNewArrival",
    })
    .populate({ path: "user", select: "-mobile -password -__v" });
  return viewCartDetails;
};

const removeProduct = async (userId, productId) => {
  let updatedCartDetails;
  if (!productId) throw new Error("productId is mandatory");
  const cartDetails = await OrderModel.findOne(
    { user: new mongoose.Types.ObjectId(userId), status: ORDER_TYPE.INCART },
    {},
    { lean: true }
  );
  if (!cartDetails) throw new Error("Cart is Empty,Product cannot be removed");
  const { products } = cartDetails;

  if (!products.find((o) => String(o.id) === String(productId))) {
    throw new Error("Product is not in cart,Please add the product");
  }
  updatedCartDetails = await OrderModel.findOneAndUpdate(
    { user: new mongoose.Types.ObjectId(userId), status: ORDER_TYPE.INCART },
    { $pull: { products: { id: new mongoose.Types.ObjectId(productId) } } },
    { new: true }
  );
  if (updatedCartDetails.products.length === 0) {
    updatedCartDetails = await OrderModel.findByIdAndUpdate(
      updatedCartDetails._id,
      { status: ORDER_TYPE.DELETED },
      { new: true }
    );
  }
  return updatedCartDetails;
};

module.exports = {
  fetchAllProducts,
  fetchProduct,
  addToCart,
  checkOutCart,
  viewOrder,
  viewCart,
  removeProduct,
};
