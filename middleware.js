module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error","you have to login ");
        return res.redirect("/login");
    }
    next();
};