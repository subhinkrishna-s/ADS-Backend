const express = require("express");
const multer = require("multer");
const router = express.Router();
const Service = require("../models/Service");
const isAdmin = require("../middlewares/CheckAdmin")

// Configure Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// API for adding a new service
router.post("/add-service", isAdmin, upload.single("coverPhoto"), async (req, res) => {
  try {
    const { name, description, price, isAvailable } = req.body;
    const coverPhoto = req.file ? req.file.path : null;

    if (!name || !description || !price || !isAvailable || !coverPhoto) {
      return res.send({ success: false, message: "Please provide all details!" });
    }

    const services = await Service.find({});
    let id = services.length > 0 ? services.slice(-1)[0].id + 1 : 1;

    const newService = new Service({ id, name, description, price, isAvailable, coverPhoto });
    await newService.save();

    return res.send({ success: true, message: "Service added successfully" });
  } catch (err) {
    console.log("Error in Adding Service:", err);
    return res.send({ success: false, message: "Trouble in adding service, Please contact developer!" });
  }
});

// API for fetching all services
router.get("/fetch-services", async (req, res) => {
  try {
    const services = await Service.find({});
    return res.send({ success: true, message: "Successfully fetched all services", services: services });
  } catch (err) {
    console.log("Error in Fetching Services:", err);
    return res.send({ success: false, message: "Trouble in fetching services, Please contact developer!" });
  }
});

// API for fetching a single service by ID
router.get("/fetch-service/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }
    const service = await Service.findOne({ id });
    if (!service) {
      return res.send({ success: false, message: "Service not found!" });
    }

    return res.send({ success: true, message: "Successfully fetched service!", service: service });
  } catch (err) {
    console.log("Error in Fetching Service:", err);
    return res.send({ success: false, message: "Trouble in fetching service, Please contact developer!" });
  }
});

// API for updating a service by ID (with optional coverPhoto update)
router.post("/update-service/:id", isAdmin, upload.single("coverPhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isAvailable } = req.body;
    const coverPhoto = req.file ? req.file.path : undefined;

    if (!id || !name || !description || !price || !isAvailable) {
      return res.send({ success: false, message: "Please provide all details!" });
    }

    const updateData = { name, description, price, isAvailable };
    if (coverPhoto) updateData.coverPhoto = coverPhoto;

    const updatedService = await Service.updateOne({ id }, { $set: updateData });
    if (!updatedService) {
      return res.send({ success: false, message: "Failed to update service!" });
    }

    return res.send({ success: true, message: "Service updated successfully" });
  } catch (err) {
    console.log("Error in Updating Service:", err);
    return res.send({ success: false, message: "Trouble in updating service, Please contact developer!" });
  }
});

// API for deleting a service by ID
router.get("/delete-service/:id", isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }

    const service = await Service.findOne({ id });
    if (!service) {
      return res.send({ success: false, message: "Service not found" });
    }

    const deletedService = await Service.deleteOne({ id });
    if (!deletedService) {
      return res.send({ success: false, message: "Failed to delete service!" });
    }

    return res.send({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    console.log("Error in Deleting Service:", err);
    return res.send({ success: false, message: "Trouble in deleting service, Please contact developer!" });
  }
});

module.exports = router;
