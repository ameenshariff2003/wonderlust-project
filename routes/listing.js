// listing js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js")
const Listing = require("../models/listing.js")
const {isLogedin, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
// multer is used to parse the img file data in backend 
const multer = require("multer");
const {storage}  = require("../cloudConfig.js")
 const upload = multer({storage});







router.route("/")
// /our first listing route
.get(wrapAsync(listingController.index))
//create route
.post(isLogedin,
   // validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing));




    //add in new route
router.get("/new",isLogedin,listingController.renderNewForm);

router.route("/:id")
    // /show route 
.get(wrapAsync(listingController.showListing))
//update route
.put(isLogedin,
    isOwner,
    upload.single("listing[image]"),

    validateListing,
    wrapAsync(listingController.updateListing))
//delete route
.delete(isLogedin,isOwner,wrapAsync(listingController.destroyListing));







//edit route
router.get("/:id/edit",isLogedin,isOwner,
    wrapAsync(listingController.renderEditForm));





module.exports = router;