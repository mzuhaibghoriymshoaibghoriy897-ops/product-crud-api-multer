const express = require("express");
const router = express.Router();

const { createCategory } = require("../controllers/categoryControlller");
const upload = require("../middleware/upload");

router.post("/", upload.single("image"), createCategory);

module.exports = router;