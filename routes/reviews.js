const express = require("express");
const router = express.Router({ mergeParams: true });// mergeParams:true  ka use krte hau ki jab app.js se-- app.use("/listings/:id/reviews",reviews);  me req jati hai to id app.js me rah jati hai 
//  to vo id yaha bhi aaye iss sur grr usme kisi aur ki id store hi to vo work kre isliye use krte hai
const review = require('../model/review');
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");

const{isLoggedIn,validateReview,isReviewAuthor}=require('../middleware');




// reviewspost  route----
router.post("/", async (req, res) => {
    let listingDetails = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    newReview.author=req.user.id;
    console.log(newReview);
    listingDetails.reviews.push(newReview);
    await newReview.save();
    await listingDetails.save();
    req.flash("success","Review Added !");
    console.log("reviewas saved");
    res.redirect(`/listings/${listingDetails.id}`);


})
//review delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // $pull method se dlt hoga vo review jis review ki id match hogi -
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`);

}))

module.exports = router;