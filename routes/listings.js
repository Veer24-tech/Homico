const express=require("express");
const router=express.Router();  // router class --
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");
const { wrap } = require('module');
const{isLoggedIn,isowner,validateListing}=require('../middleware');
const listingController=require('../controllers/listing');
const multer=require('multer');
const{storage}=require("../cloudConfig");
const upload=multer({storage});




// router.get("/", wrapAsync(listingController.index));
//using routter.route---->
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'),
wrapAsync(listingController.createListing)
);    

//new route
router.get("/new", isLoggedIn,(listingController.renderNewForm));

router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(validateListing,  isowner,upload.single('listing[image]'),   wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isowner, wrapAsync(listingController.deleteListing));

//show route
// router.get("/:id", wrapAsync(listingController.showListing));


// post rote for saving data of form in database
// router.post("/", validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(listingController.renderEditForm));


// saving the updated data  of listings in the database
// router.put("/:id",validateListing,  isowner,   wrapAsync(listingController.updateListing));

//delete listing
// router.delete("/:id",isLoggedIn,isowner, wrapAsync(listingController.deleteListing));


module.exports=router;