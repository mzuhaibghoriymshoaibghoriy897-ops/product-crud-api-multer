const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { deleteFile } = require("../utils/fileHelper");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Adds a full imageUrl to the product we send back
const withImageUrl = (req, product) => {
  const obj = product.toObject ? product.toObject() : product;
  obj.imageUrl = obj.image ? `${req.protocol}://${req.get("host")}/${obj.image}` : null;
  return obj;
};

// One place that turns any error into a JSON response
// (and removes the just-uploaded file so no orphan images are left behind)
const handleError = (req, res, error) => {
  if (req.file) deleteFile(req.file.filename);
  const status =
    error.status || (error.name === "ValidationError" || error.name === "CastError" ? 400 : 500);
  res.status(status).json({ success: false, message: error.message });
};

const ensureCategoryExists = async (categoryId) => {
  if (!isValidId(categoryId)) throw httpError(400, "Invalid category id");
  const exists = await Category.exists({ _id: categoryId });
  if (!exists) throw httpError(404, "Category not found");
};

// POST /api/products  (multipart/form-data, optional "image" file)
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, isActive } = req.body || {};

    if (category) await ensureCategoryExists(category);

    const product = new Product({
      name,
      category,
      price,
      description,
      stock,
      isActive,
      image: req.file ? "uploads/" + req.file.filename : null,
    });
    await product.save();
    await product.populate("category");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: withImageUrl(req, product),
    });
  } catch (error) {
    handleError(req, res, error);
  }
};

// GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json({
      success: true,
      count: products.length,
      data: products.map((p) => withImageUrl(req, p)),
    });
  } catch (error) {
    handleError(req, res, error);
  }
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) throw httpError(400, "Invalid product id");

    const product = await Product.findById(req.params.id).populate("category");
    if (!product) throw httpError(404, "Product not found");

    res.status(200).json({ success: true, data: withImageUrl(req, product) });
  } catch (error) {
    handleError(req, res, error);
  }
};

// PUT /api/products/:id  (image is optional - if sent, it replaces the old one)
exports.updateProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) throw httpError(400, "Invalid product id");

    const product = await Product.findById(req.params.id);
    if (!product) throw httpError(404, "Product not found");

    const body = req.body || {};
    if (body.category) await ensureCategoryExists(body.category);

    ["name", "category", "price", "description", "stock", "isActive"].forEach((field) => {
      if (body[field] !== undefined) product[field] = body[field];
    });

    const oldImage = product.image;
    if (req.file) product.image = "uploads/" + req.file.filename;

    await product.save();

    // Only remove the old image after the new data is safely saved
    if (req.file && oldImage) deleteFile(oldImage);

    await product.populate("category");
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: withImageUrl(req, product),
    });
  } catch (error) {
    handleError(req, res, error);
  }
};

// DELETE /api/products/:id  (also removes the image file from disk)
exports.deleteProduct = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) throw httpError(400, "Invalid product id");

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw httpError(404, "Product not found");

    deleteFile(product.image);

    res.status(200).json({
      success: true,
      message: "Product and its image deleted successfully",
    });
  } catch (error) {
    handleError(req, res, error);
  }
};
