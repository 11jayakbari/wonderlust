const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync.js")
const Listing=require("../models/listing.js")
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js")

const listingController=require("../controllers/listing.js")

router
    .route("/")
// index route
    .get(wrapAsync(listingController.index))
// create route
    .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing))


// new route..show ni uper otherwise it serch for listings/:id instaed of new
router.get("/new",isLoggedIn,listingController.renderNewForm)

// show route
router.get("/:id", wrapAsync(listingController.showListing));


// edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm))
// update
router.put("/:id", isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))

// delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports=router