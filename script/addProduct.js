const mongoose = require("mongoose");

const { ProductModel } = require("../models/product.model");
const products = require("./products.json")

const DB = "mongodb://127.0.0.1:27017/baggit";

const addProduct = async()=>{
    await ProductModel.create(products);
}

mongoose.connect(DB,{ useNewUrlParser: true}).then(async()=>{
    await addProduct();
    console.log("script run successfully")
})