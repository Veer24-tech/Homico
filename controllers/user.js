const User = require("../model/user");

//signupform
module.exports.renderSigupForm=(req, res) => {
   res.render("users/signup");
}

//loginform
module.exports.renderLoginForm=(req, res) => {
   res.render("users/login");
}
// siupuser post req
module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
      const newUser= new User({email,username});
   const regUser=await User.register(newUser ,password);
    console.log(regUser);
   req.login(regUser,(err)=>{      // autometic login ater signup----->
      if(err){
         return next(err);
      }
        req.flash("success","Welcome to Homico ");
   res.redirect("/listings");
   });   
}catch(err){
    console.log(err)
    req.flash("error",err.message);
    res.redirect("/signup");
}
 }
 // login

 module.exports.login= async (req, res) => {
      req.flash("success", "Login Succesfull ! Welcome to HOMICO");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
   }


   //logout
   module.exports.logout=(req, res, next) => {
   req.logout((err) => {
      if (err) {
         return next(errr);
      }
      req.flash("success", "You are logout !");
      res.redirect("/listings");
   })
}

