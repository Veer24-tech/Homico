const Listing=require('./model/listing');
const Review=require('./model/review');
const ExpressError = require("./utils/ExpressError");// for validate listing   and validete review
const{listingSchema,reviewSchema}=require("./schema");// for validate listing&& validate reviewe


module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        //  original urlsave ------
        req.session.redirectUrl=req.originalUrl;   // jis url me jana chahate the vaha ka url store krega 
        req.flash("error","you have to login ");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;    //agr reqobject me aaya hai original url to locals me save krana hai  
}
next();
}
  
//midlleware ---authorixation for   editing and deleting listing by owner only
module.exports.isowner=async(req,res,next)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not the owner of this listings");
       return res.redirect(`/listings/${id}`);
    }
    next();
}



//joi function for schema validation-   validatelistings
  module.exports.validateListing=(req,res,next)=>{

// let result=listingSchema.validate(req.body);
let {error}=listingSchema.validate(req.body);
// console.log(result);
if(error){  
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
}  
else{
    next();
}
}


//validate review--
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg)
    } else {
        next();
    }


}

//delete review -->   review author

module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not allowed to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}