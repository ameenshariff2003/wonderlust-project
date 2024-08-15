const Listing = require("./models/listing");
const ExpressError = require("./utils/Expresserror.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLogedin = (req,res,next)=>{
  console.log(req.user);
     //By default the logged in user info isstoredin   req.user
     //is authenticated is used for check weather the user is logim or not
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;

         req.flash("error","you must login")
       return  res.redirect("/login");
     }
        next();
}


//So when we try to log in and land on some particular page we can redirect but passport resets the information which is stored in session so first we have to store the session information in the locals and then we can log into it
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){ 
    res.locals.redirectUrl =  req.session.redirectUrl
  }
  next();
};

module.exports.isOwner = async(req,res,next) =>{
       
  let {id} =req.params;
  // deconstructing the body and \
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you dont have permission to access");
        return  res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateListing = (req,res,next)=>{
  let {error} =listingSchema.validate(req.body);
  
  if(error){
      //all the error details is stored  in obj where key name is details so we are extracting and map to pring t indually
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
  }
  next();
};

//validating review middle ware
module.exports.validateReview = (req,res,next)=>{
  let {error} =reviewSchema.validate(req.body);
  
  if(error){
      //all the error details is stored  in obj where key name is details so we are extracting and map to pring t indually
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
  } 
  next();
};

module.exports.isReviewAuthor = async(req,res,next) =>{
       
  let {id,reviewId} =req.params;
  // deconstructing the body and \
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","you dont have permission to access");
        return  res.redirect(`/listings/${id}`);
}
next();
};