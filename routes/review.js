const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError =require("../utils/ExpressError.js");
const { reviewSchema}=require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");




const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};

const reviewController = require("../contollers/reviews.js")

//REVIEWS
//POST REVIEW ROUTE
router.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));

//DELETE REVIEW ROUTE

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;