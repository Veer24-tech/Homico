const express = require("express");
const router = express.Router({ mergeParams: true });// mergeParams:true  ka use krte hau ki jab app.js se-- app.use("/listings/:id/reviews",reviews);  me req jati hai to id app.js me rah jati hai 
//  to vo id yaha bhi aaye iss sur grr usme kisi aur ki id store hi to vo work kre isliye use krte hai
const review = require('../model/review');
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const{isLoggedIn}=require('../middleware');


//validate review--
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg)
    } else {
        next();
    }


}
// reviewspost  route----
router.post("/", async (req, res) => {
    let listingDetails = await Listing.findById(req.params.id);
    let newReview = new review(req.body.review);

    listingDetails.reviews.push(newReview);
    await newReview.save();
    await listingDetails.save();
    req.flash("success","Review Added !");
    console.log("reviewas saved");
    res.redirect(`/listings/${listingDetails.id}`);


})
//review delete route
router.delete("/:reviewId", isLoggedIn,wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // $pull method se dlt hoga vo review jis review ki id match hogi -
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`);

}))

module.exports = router;