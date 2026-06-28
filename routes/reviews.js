const express = require("express");
const router = express.Router({ mergeParams: true });// mergeParams:true  ka use krte hau ki jab app.js se-- app.use("/listings/:id/reviews",reviews);  me req jati hai to id app.js me rah jati hai 
//  to vo id yaha bhi aaye iss sur grr usme kisi aur ki id store hi to vo work kre isliye use krte hai
const review = require('../model/review');
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require('../utils/ExpressError');
const{isLoggedIn,validateReview,isReviewAuthor}=require('../middleware');
const reviewController=require("../controllers/review");




// reviewspost  route----
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.postReview));
//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;