const express = require("express");
const router = express.Router();
const UserModel = require("../models/User");
const isAdmin = require("../middlewares/CheckAdmin")

// API for Creating new user
router.post("/add-user", isAdmin, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    let Users = await UserModel.find({});
    let id;
    if(Users.length>0){
        id = Users.slice(-1)[0].id+1;
    }else{
        id = 1
    }

    if(!id){
        return res.send({success: false, message: "Invalid ID Generation, Please contact developer!"})
    }

    if(!name || !email || !role || !password){
        return res.send({success: false, message: "Please provide all details!"})
    }

    const newUser = new UserModel({ id, name, email, role, password });
    await newUser.save();
    return res.send({ success: true, message: "User added successfully"});
  } catch (err) {
    console.log("Error in creating User:",err)
    return res.send({ success: false, message: "Failed to add user, Please contact developer!" });
  }
});

// API for fetching all users
router.get("/fetch-users", isAdmin, async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.send({success: true, message: "fetched Users successfully!", users: users});
  } catch (err) {
    console.log("Error in fetching Users:",err)
    return res.send({ success: false, message: "Failed to fetch users, Please contact developer!" });
  }
});

// API for fetching a user by ID
router.get("/fetch-user/:id", isAdmin, async (req, res) => {
  try {
    if(!req.params.id){
        return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" })
    }
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    return res.send({success: true, message: "fetched User successfully!", user: user});
  } catch (err) {
    console.log("Error in fetching User:",err)
    return res.send({ success: false, message: "Failed to fetch user, Please contact developer!" });
  }
});

// API for Updating a user by ID
router.post("/update-user/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id
    if(!id){
        return res.send({ success: false, message: "Please provide a valid parameter in API Endpoint!" })
    }
    const { name, email, role, password } = req.body;

    if(!name || !email || !role || !password){
        return res.send({success: false, message: "Please provide all details!"})
    }

    const user = await UserModel.findOne({ id });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    const updatedUser = await UserModel.updateOne(
      { id: id },
      { $set:{ name, email, role, password } }
    );

    if (!updatedUser) {
      return res.send({ success: false, message: "Failed to update User!" });
    }
    return res.send({ success: true, message: "User updated successfully!"});
  } catch (err) {
    console.log("Error in updating User:",err)
    return res.send({ success: false, message: "Failed to update user, Please contact developer!" });
  }
});

// API for deleting a user by ID
router.get("/delete-user/:id", isAdmin, async (req, res) => {
  try {
    const deletedUser = await UserModel.deleteOne({ id: req.params.id });
    if (!deletedUser) {
      return res.send({ success: false, message: "Failed to delete User!" });
    }
    return res.send({ success: true, message: "User deleted successfully!" });
  } catch (err) {
    console.log("Error in updating User:",err)
    return res.send({ success: false, message: "Failed to delete user, Please contact developer!" });
  }
});

module.exports = router;
