const express=require("express");
const router=express.Router();  // router class --
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");
const { wrap } = require('module');
const{isLoggedIn,isowner,validateListing}=require('../middleware');
const listingController=require('../controllers/listing');




router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,(listingController.renderNewForm));


//show route
router.get("/:id", wrapAsync(listingController.showListing));


// post rote for saving data of form in database
router.post("/", validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(listingController.renderEditForm));


// saving the updated data  of listings in the database
router.put("/:id",validateListing,  isowner,   wrapAsync(listingController.updateListing));

//delete listing
router.delete("/:id",isLoggedIn,isowner, wrapAsync(listingController.deleteListing));


module.exports=router;