const Listing=require('./model/listing');
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