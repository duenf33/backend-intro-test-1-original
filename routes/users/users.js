var express = require('express');
var router = express.Router();
var axios = require("axios");
// const bcrypt = require("./bcryptjs")
// const User = require("./model/User");
const {
  displayUsers,
  displaySignup,
  displayLogin,
  reqHome,
  resHome,
  signup,
  login,
  userDelByEmail,
  userDelByID,
  userByIDUpdate,
  userByEmailUpdate,
  logout,
} = require("./controller/userController");

const { signupLogicInputIsEmpty } = require("./lib/signupLogic");
const { signupLogicDataType } = require("./lib/signupLogicDataType");
const { 
  loginLogicEmptyMiddleware, 
  checkEmailFormat, } 
  = require("./lib/loginLogic");

/* GET users listing. */
router.get("/get-all-users", displayUsers);

router.get("/create-user", displaySignup);

router.get("/login", displayLogin)

router.get("/home", reqHome);

router.post("/home", resHome);
//v4 async and await
router.post("/create-user", signupLogicInputIsEmpty, signupLogicDataType, signup);

router.post("/login", loginLogicEmptyMiddleware, checkEmailFormat, login);

router.delete("/delete-user-by-id/:id", userDelByID);

router.delete("/delete-user-by-email", userDelByEmail);

//update user by id
router.put("/update-user-by-id/:id", userByIDUpdate);

//update user by email
router.put("/update-user-by-email/", userByEmailUpdate);

router.get("/logout", logout);

module.exports = router;