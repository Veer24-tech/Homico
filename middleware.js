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