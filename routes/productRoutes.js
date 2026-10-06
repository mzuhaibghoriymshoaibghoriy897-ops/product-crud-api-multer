const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

router
  .route("/")
  .post(upload.single("image"), productController.createProduct)
  .get(productController.getAllProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(upload.single("image"), productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
