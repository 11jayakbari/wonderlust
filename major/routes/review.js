const express=require("express")
const router=express.Router({mergeParams:true})    //bcz review na path ne merge karva
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const Review=require("../models/reviews.js")
const Listing=require("../models/listing.js")
const {validateReview, isLoggedIn}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js")
const { destroyListing } = require("../controllers/listing.js")



// reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))
// delete reviews
router.delete("/:reviewId",wrapAsync(reviewController.destroyReview))

module.exports=router