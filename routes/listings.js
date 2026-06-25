const express=require("express");
const router=express.Router();  // router class --
const Listing = require('../model/listing');
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const{listingSchema}=require("../schema");
const { wrap } = require('module');
const{isLoggedIn}=require('../middleware');

//joi function for schema validation-
  const validateListing=(req,res,next)=>{

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

router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("Listings/index.ejs", { allListings });


}));

//new route
router.get("/new", isLoggedIn,(req, res) => {
    
    res.render("Listings/new.ejs");
})


//show route
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listingDetails = await Listing.findById(id).populate("reviews");
    if(!listingDetails){
        req.flash("error","Listing you requested for does not exsists!");
        return res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listingDetails });
}));


// post rote for saving data of form in database
router.post("/", validateListing, wrapAsync(async (req, res,next) => {
//-- joi validation--//
// let result=listingSchema.validate(req.body);
// console.log(result);                          ----->>   uper function banay diya ab iske liye bas uss function ko use kro
// if(result.err){
//     throw new ExpressError(404,res.err);

// }

    // if (!req.body.listing) {
    //     throw (new ExpressError(400, "Send valid data !"));
    // }

    //method 1- let{title,description,price,country,location}=req.body.listing;
    //  method 2-> let listing=req.body.listing;    pr iske liye form me name me aise likna hoga listing[title],listing[description] etc  
    // method 3-> directly create a new listing object and save it in the database
    const newListing = new Listing(req.body.listing);
    // jab data like hospscoh bse send kiya jaye   --> hm chate hai ki agr koi detals missing hai to save na data base me 
    //form wala to handle ho gya tha pr listings me post req hospcoch s e bhjeje ge to aad ho jaygi listing 
    //isiliye ye error handle krna ke method 1 hai-


    // if (!newListing.title) {
    //     throw (new ExpressError(400, "Title is missing"));
    // }
    // if (!newListing.description) {
    //     throw (new ExpressError(400, "description is missing"));
    // }


    //aaise hi sare feilds ke liye define krge jo ek aacha devloper ka quality nahui hai-----we use JOI for schema validation
    await newListing.save();  // save the form data in the database
    req.flash("success","Listing Added Successfully");// flash message when listing addes succesfully
    res.redirect("/listings");

}));

//edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listingDetails = await Listing.findById(id);
    if(!listingDetails){
        req.flash("error","Listing you requested for does not exsists");
        return res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listingDetails });
}));


// saving the updated data  of listings in the database
router.put("/:id",validateListing,     wrapAsync(async (req, res) => {
    let { id } = req.params;
    //// req.body.listing me form ka sara updated data (title, description, price, etc.) object ke form me hota hai.
    // findByIdAndUpdate() ko ye object dekar database me matching fields update kar dete hain.

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });//{...req.body.listing} ka use krte hai kyuki req.body.listing me title,description,price,country,location sab hote hai to unko alag alag pass krne ke bajaye ...req.body.listing se sare data ko pass kr dete hai
    req.flash("success","Details Updated!");
    res.redirect(`/listings/${id}`);
}));
//delete listing
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted succesfully");
    console.log("deleted listing details", deletedListing.title);
    res.redirect("/listings");
}))


module.exports=router;