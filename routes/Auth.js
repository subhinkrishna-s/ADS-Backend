const express = require("express");
const router = express.Router();
const User = require("../models/User");
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/CheckAdmin")


// API for user Registration and login
router.post("/register", isAdmin, async (req, res) => {
  try {
    const { id, name, email, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ success: false, message: "User already exists" });
    }

    const newUser = new User({ id, name, email, role, password });
    await newUser.save();

    req.session.user = { id: newUser.id, email: newUser.email, role: newUser.role };

    return res.send({ success: true, message: "User registered and logged in successfully", user: req.session.user });
  } catch (err) {
    console.log("Error in Registering User:",err)
    return res.send({ success: false, message: "Trouble in user Registration, Please contact developer!" });
  }
});

// API for Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.send({success: false, message: "Please provide all details!"})
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.send({ success: false, message: "Invalid email or password" });
    }

    req.session.user = { id: user.id, email: user.email, role: user.role };

    req.session.save((err) => {
      if (err) {
          console.log("Session save error:", err);
          return res.send({ success: false, message: "Session save failed" });
      }
      return res.send({ success: true, message: "Logged in successful!" });
  })

  } catch (err) {
    console.log("Error in Login:",err)
    return res.send({ success: false, message: "Tourble in Login, Please contact developer!" });
  }
});

// API for Logout
router.get("/logout", isAuth, (req, res) => {
    try{
        req.session.destroy((err) => {
            if (err) {
            return res.send({ success: false, message: "Logout failed" });
            }
            return res.send({ success: true, message: "Logged out successfully" });
        });
    }
    catch (err) {
    console.log("Error in Logout:",err)
        return res.send({ success: false, message: "Trouble in logout, Please contact developer!" });
    }
});

// API for fetching session user (Check if logged in)
router.get("/fetch-authuser", isAuth, (req, res) => {
    try{
        if (req.session.user) {
            return res.send({ success: true, message: "Successfully fetched the current auth User!", user: req.session.user });
        } else {
            return res.send({ success: false, message: "No user logged in" });
        }
    }
    catch (err) {
        console.log("Error in fetching Auth User:",err)
        return res.send({ success: false, message: "Trouble in fetching Auth user, Please contact developer!" });
    }
});

module.exports = router;
