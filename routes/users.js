const express = require("express");
const router = express.Router();
const User = require('../model/user');
const passport = require("passport");
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require("../middleware"); // original url me redirect hone kr liye ,locals me orginal url save krna hai 
const userController = require('../controllers/user');

router.route("/signup")
.get( userController.renderSigupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
   failureRedirect: "/login",failureFlash: true }),userController.login);



   // logout---
router.get("/logout", userController.logout);

module.exports = router;