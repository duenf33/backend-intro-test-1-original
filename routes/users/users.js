var express = require('express');
var router = express.Router();
var axios = require("axios");
// const bcrypt = require("./bcryptjs")
// const User = require("./model/User");
const {
  getAllUsers,
  sendToSignup,
  sendToLogin,
  getHome,
  postHome,
  signup,
  login,
  deleteUserByEmail,
  deleteUserByID,
  updateUserByID,
  updateUserByEmail,
  logout,
} = require("./controller/userController");

const { checkSignupInputIsEmpty } = require("./lib/checkSignup");
const { checkSignupDataType } = require("./lib/checkSignupDataType");
const { 
  checkLoginEmptyMiddleware, 
  checkEmailFormat, } 
  = require("./lib/checkLogin");

/* GET users listing. */
router.get("/get-all-users", getAllUsers);

router.get("/create-user", sendToSignup);

router.get("/login", sendToLogin)

router.get("/home", getHome);

router.post("/home", postHome);
//v4 async and await
router.post("/create-user", checkSignupInputIsEmpty, checkSignupDataType, signup);

router.post("/login", checkLoginEmptyMiddleware, checkEmailFormat, login);

router.delete("/delete-user-by-id/:id", deleteUserByID);

router.delete("/delete-user-by-email", deleteUserByEmail);

//update user by id
router.put("/update-user-by-id/:id", updateUserByID);

//update user by email
router.put("/update-user-by-email/", updateUserByEmail);

router.get("/logout", logout);

module.exports = router;