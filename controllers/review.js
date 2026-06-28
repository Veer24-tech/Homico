const Listing=require('../model/listing');
const review=require('../model/review');



// post review----
module.exports.postReview=async (req, res) => {
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


}
//delete review
module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // $pull method se dlt hoga vo review jis review ki id match hogi -
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted !")
    res.redirect(`/listings/${id}`);

}