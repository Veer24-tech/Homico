let Listing=require('../model/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: mapToken });


module.exports.index =(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("Listings/index.ejs", { allListings });
});


//new listing
module.exports.renderNewForm=(req, res) => {
    
    res.render("Listings/new.ejs");
}
// show listing ---
module.exports.showListing=async (req, res, next) => {
    let { id } = req.params;
    let listingDetails = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listingDetails){
        req.flash("error","Listing you requested for does not exsists!");
        return res.redirect("/listings");
    }
    res.render("Listings/show.ejs", { listingDetails });
}

//create listing form---
module.exports.createListing=(async (req, res,next) => {

  let response= await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();
  

    console.log(req.file);
    let url=req.file.path;
    let filename=req.file.filename; 
    // console.log(url);
    // console.log(filename);
   
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

  newListing.owner=req.user._id;
    //aaise hi sare feilds ke liye define krge jo ek aacha devloper ka quality nahui hai-----we use JOI for schema validation
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();  // save the form data in the database
    console.log(savedListing);

    req.flash("success","Listing Added Successfully");// flash message when listing addes succesfully
    res.redirect("/listings");

})


module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let listingDetails = await Listing.findById(id);
    if(!listingDetails){
        req.flash("error","Listing you requested for does not exsists");
        return res.redirect("/listings");
    }
    res.render("Listings/edit.ejs", { listingDetails });
}

// updatelisting
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    //// req.body.listing me form ka sara updated data (title, description, price, etc.) object ke form me hota hai.
    // findByIdAndUpdate() ko ye object dekar database me matching fields update kar dete hain.
  
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

   let listing= await Listing.findByIdAndUpdate(id,
    {...req.body.listing},{new:true}
   );//{...req.body.listing} ka use krte hai kyuki req.body.listing me title,description,price,country,location sab hote hai to unko alag alag pass krne ke bajaye ...req.body.listing se sare data ko pass kr dete hai
       listing.geometry = response.body.features[0].geometry;
   if(typeof req.file!=="undefined"){ 
   let url=req.file.path;// cloudinary se image save hone ke baad link
    let filename=req.file.filename;
    listing.image={url,filename}// puraniu image ka link aur filename new image se change
 
   
}
 await listing.save();
   req.flash("success","Details Updated!");
    res.redirect(`/listings/${id}`);
}
//delete listing
module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted succesfully");
    console.log("deleted listing details", deletedListing.title);
    res.redirect("/listings");
}