const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLogedin, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")







//review route
router.post("/",isLogedin,

    validateReview,wrapAsync(reviewController.createReview));
 // delete review route
 // to delete the review which is inside listing model and also in review model we use pull
 
 router.delete("/:reviewId",isLogedin,isReviewAuthor,
    wrapAsync(reviewController.destroyReview));


 module.exports = router;