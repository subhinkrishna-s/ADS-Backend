const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// API for placing a new order
router.post("/place-order", async (req, res) => {
  try {
    const { customerName, email, contact, address, productId, size, quantity, totalAmount } = req.body;
    
    if (!customerName || !email || !contact || !address || !productId || !size || !quantity || !totalAmount) {
      return res.send({ success: false, message: "Please provide all details!" });
    }

    if (!size || !size.height || !size.width) {
        return res.send({ success: false, message: "Please provide size with both height and width!" });
    }

    if (typeof size.height !== 'number' || typeof size.width !== 'number') {
        return res.send({ success: false, message: "Height and width should be numbers!" });
    }
    
    const orders = await Order.find({});
    let id = orders.length > 0 ? orders.slice(-1)[0].id + 1 : 1;
    if (!id) {
        return res.send({ success: false, message: "Failed to generate ID, please contact developer!" });
    }
    
    const newOrder = new Order({ id, customerName, email, contact, address, productId, size, quantity, totalAmount });
    await newOrder.save();
    
    return res.send({ success: true, message: "Order placed successfully" });
  } catch (err) {
    console.log("Error in Placing Order:", err);
    return res.send({ success: false, message: "Trouble in placing order, Please contact developer!" });
  }
});

// API for fetching all orders
router.get("/fetch-orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.send({ success: true, message: "Successfully fetched all orders", orders: orders });
  } catch (err) {
    console.log("Error in Fetching Orders:", err);
    return res.send({ success: false, message: "Trouble in fetching orders, Please contact developer!" });
  }
});

// API for fetching a single order by ID
router.get("/fetch-order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }

    const order = await Order.findOne({ id });
    if (!order) {
      return res.send({ success: false, message: "Order not found" });
    }

    return res.send({ success: true, message: "Successfully fetched order!", order: order });
  } catch (err) {
    console.log("Error in Fetching Order:", err);
    return res.send({ success: false, message: "Trouble in fetching order, Please contact developer!" });
  }
});

// API for updating only the status of an order by ID
router.post("/update-order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id || !status) {
      return res.send({ success: false, message: "Please provide a valid ID and status!" });
    }

    const order = await Order.findOne({ id });
    if (!order) {
      return res.send({ success: false, message: "Order not found" });
    }
    
    const updatedOrder = await Order.updateOne(
      { id },
      { $set: { status } }
    );
    if (!updatedOrder) {
      return res.send({ success: false, message: "Failed to update order status!" });
    }
    
    return res.send({ success: true, message: "Order status updated successfully" });
  } catch (err) {
    console.log("Error in Updating Order Status:", err);
    return res.send({ success: false, message: "Trouble in updating order status, Please contact developer!" });
  }
});

// API for deleting an order by ID
router.get("/delete-order/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" });
    }

    const order = await Order.findOne({ id });
    if (!order) {
      return res.send({ success: false, message: "Order not found" });
    }

    const deletedOrder = await Order.deleteOne({ id });
    if (!deletedOrder) {
      return res.send({ success: false, message: "Failed to delete order!" });
    }

    return res.send({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.log("Error in Deleting Order:", err);
    return res.send({ success: false, message: "Trouble in deleting order, Please contact developer!" });
  }
});

module.exports = router;
