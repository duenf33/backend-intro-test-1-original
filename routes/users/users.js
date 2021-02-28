var express = require('express');
var router = express.Router();
var axios = require("axios");
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
  loginLogicEmptyMiddleware, } 
  = require("./lib/loginLogic");
router.get("/get-all-users", displayUsers);
router.get("/create-user", displaySignup);
router.get("/login", displayLogin)
router.get("/home", reqHome);
router.post("/home", resHome);
router.post("/create-user", signupLogicInputIsEmpty, signupLogicDataType, signup);
router.post("/login", loginLogicEmptyMiddleware, login);
router.delete("/delete-user-by-id/:id", userDelByID);
router.delete("/delete-user-by-email", userDelByEmail);
router.put("/update-user-by-id/:id", userByIDUpdate);
router.put("/update-user-by-email/", userByEmailUpdate);
router.get("/logout", logout);
module.exports = router;