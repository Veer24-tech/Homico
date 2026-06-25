const express=require("express");
const router=express.Router(); 
const User=require('../model/user');
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware"); // original url me redirect hone kr liye ,locals me orginal url save krna hai 
 
router.get("/signup",(req,res)=>{
    res.render("users/signup");
 });

 router.post("/signup",async(req,res)=>{
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
   })
   
   
}catch(err){
    console.log(err)
    req.flash("error",err.message);
    res.redirect("/signup");
}
 })

 router.get("/login",(req,res)=>{
   res.render("users/login");
 })

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>{
   req.flash("success","Login Succesfull ! Welcome to HOMICO");
   let redirectUrl=res.locals.redirectUrl || "/listings";
   res.redirect(redirectUrl);
})


// logout---

router.get("/logout",(req,res,next)=>{
   req.logout((err)=>{
      if(err){
         return next(errr);
      }
      req.flash("success","You are logout !");
      res.redirect("/listings");
   })
})

module.exports=router;