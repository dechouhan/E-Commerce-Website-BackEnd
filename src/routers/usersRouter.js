const express = require("express");
const Users = require("../models/usersModel");
const routerUsers = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/Auth");
routerUsers.post("/signup", async (req, res) => {
  const userExist = await Users.findOne({ email: req.body.email });
  if (userExist) {
    return res.status(403).json({ message: "Email is Taken" });
  }
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await new Users({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    address:req.body.address,
    city: req.body.city,
    mobile:req.body.mobile,

  });
  await user.save();
  res.status(200).json({ user, message: "success" });
});

routerUsers.post("/login", async (req, res) => {
  const fetchUser = await Users.findOne({ email: req.body.email });
  try{
    if (!fetchUser) {
      return res.status(401).json({
        message: "Auth failed no such user",
      });
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      fetchUser.password
    );
    if (!checkPassword) {
      return res.status(401).json({
        message: "Auth failed inccorect password",
      });
    }
    const token = jwt.sign(
      { email: fetchUser.email, userId: fetchUser._id },
      "secret_this_should_be_longer",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      _id: fetchUser._id,
      email: fetchUser.email,
      name: fetchUser.name,
      city: fetchUser.city,
      message: "Login Successfully",
    });
  }
  catch(err) {
    res.status(404).send({message:"User Not Exist"})
  }
  
});

routerUsers.get("/users",async (req, res) => {
  try {
    const allUsersData = await Users.find({});
    res.send(allUsersData);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = routerUsers;
