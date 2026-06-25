const express=require("express");
const router=express.Router(); 
const User=require('../model/user');
const passport = require("passport");
 
router.get("/signup",(req,res)=>{
    res.render("users/signup");
 });

 router.post("/signup",async(req,res)=>{
    try{
    let {username,email,password}=req.body;
      const newUser= new User({email,username});
   const regUser=await User.register(newUser ,password);
   console.log(regUser);
   req.flash("success","Welcome to Homico ");
   res.redirect("/listings");
   
}catch(err){
    console.log(err)
    req.flash("error",err.message);
    res.redirect("/signup");
}
 })

 router.get("/login",(req,res)=>{
   res.render("users/login");
 })

router.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
async(req,res)=>{
   req.flash("success","Login Succesfull ! Welcome to HOMICO");
   res.redirect("/listings");
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