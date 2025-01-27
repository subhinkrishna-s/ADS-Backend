const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");
const isAdmin = require("../middlewares/CheckAdmin")

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API for adding a new product (with image upload)
router.post("/add-product", isAdmin, upload.fields([{ name: "coverPhoto" }, { name: "framePhoto" }]), async (req, res) => {
  try {
    let { name, availableSizes, price, isAvailable } = req.body;
    console.log("req:",req.body)

    if (!name || !req.files.coverPhoto || !req.files.framePhoto || !availableSizes || !price || !isAvailable) {
      return res.send({ success: false, message: "Please provide all required details!" });
    }

    // Convert `isAvailable` to a boolean
    isAvailable = isAvailable === "true";

    // Parse `availableSizes`
    try {
      availableSizes = JSON.parse(availableSizes);
      if (!Array.isArray(availableSizes) || availableSizes.length === 0) {
          throw new Error("Invalid availableSizes format");
      }
    } catch (error) {
        return res.send({ success: false, message: "Invalid availableSizes format! Must be a JSON array." });
    }

    // Validate each size object
    for (const size of availableSizes) {
        if (typeof size.height !== "number" || typeof size.width !== "number") {
            return res.send({ success: false, message: "Height and width should be valid numbers!" });
        }
    }

    const lastProduct = await Product.findOne().sort({ id: -1 });
    const id = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = new Product({
      id,
      name,
      coverPhoto: req.files.coverPhoto[0].path,
      framePhoto: req.files.framePhoto[0].path,
      availableSizes,
      price,
      isAvailable,
    });

    await newProduct.save();
    return res.send({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.log("Error in Adding Product:", err);
    return res.send({ success: false, message: "Trouble in adding product, Please contact developer!" });
  }
});

// API for fetching all products
router.get("/fetch-products", async (req, res) => {
  try {
    const products = await Product.find({});
    return res.send({ success: true, message: "Successfully fetched all products", products: products });
  } catch (err) {
    console.log("Error in Fetching Products:", err);
    return res.send({ success: false, message: "Trouble in fetching products, Please contact developer!" });
  }
});

// API for fetching a single product by ID
router.get("/fetch-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.send({ success: false, message: "Please provide a valid product ID!" });
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.send({ success: false, message: "Product not found" });
    }

    return res.send({ success: true, message: "Successfully fetched product!", product: product });
  } catch (err) {
    console.log("Error in Fetching Product:", err);
    return res.send({ success: false, message: "Trouble in fetching product, Please contact developer!" });
  }
});

// API for updating a product by ID (with optional image update)
router.post("/update-product/:id", isAdmin, upload.fields([{ name: "coverPhoto" }, { name: "framePhoto" }]), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id:',id)
    console.log('id type:',typeof id)
    if (!id || id === 'undefined') {
      return res.send({ success: false, message: "Please provide a valid product ID!" });
    }

    let { name, availableSizes, price, isAvailable } = req.body;

    if (!name || !availableSizes || !price || !isAvailable) {
      return res.send({ success: false, message: "Please provide all details!" });
    }

    // Convert `isAvailable` to a boolean
    isAvailable = isAvailable === "true";

    // Parse `availableSizes`
    try {
      availableSizes = JSON.parse(availableSizes);
      if (!Array.isArray(availableSizes) || availableSizes.length === 0) {
        throw new Error("Invalid availableSizes format");
      }
    } catch (error) {
      return res.send({ success: false, message: "Invalid availableSizes format! Must be a JSON array." });
    }

    // Validate each size object
    for (const size of availableSizes) {
      if (typeof size.height !== "number" || typeof size.width !== "number") {
        return res.send({ success: false, message: "Height and width should be valid numbers!" });
      }
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.send({ success: false, message: "Product not found" });
    }

    let updatedFields = { name, availableSizes, price, isAvailable };

    if (req.files.coverPhoto) {
      updatedFields.coverPhoto = req.files.coverPhoto[0].path;
    }
    if (req.files.framePhoto) {
      updatedFields.framePhoto = req.files.framePhoto[0].path;
    }

    await Product.updateOne({ id }, { $set: updatedFields });

    return res.send({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.log("Error in Updating Product:", err);
    return res.send({ success: false, message: "Trouble in updating product, Please contact developer!" });
  }
});


// API for deleting a product by ID
router.get("/delete-product/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid product ID!" });
    }

    const product = await Product.findOne({ id });
    if (!product) {
      return res.send({ success: false, message: "Product not found" });
    }

    if (fs.existsSync(product.coverPhoto)) {
      fs.unlinkSync(product.coverPhoto);
    }
    if (fs.existsSync(product.framePhoto)) {
      fs.unlinkSync(product.framePhoto);
    }

    await Product.deleteOne({ id });
    return res.send({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.log("Error in Deleting Product:", err);
    return res.send({ success: false, message: "Trouble in deleting product, Please contact developer!" });
  }
});

module.exports = router;
