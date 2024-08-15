const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const wrapasync = require("../utils/wrapasync");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js")


router.route("/signup")
// getting signup form
.get(userController.renderSignupForm)
// posting signup form
.post( wrapasync(userController.Signup))


router.route("/login")
.get(userController.renderLoginForm)
// /Save redirect url is a middleware which helps to continue with the same page after logging in
.post(saveRedirectUrl,
     passport.authenticate("local",{
    failureRedirect : "/login" , 
    failureFlash : true,
}),
userController.Login
    );



router.get("/logout",userController.userlogout)
module.exports = router; 