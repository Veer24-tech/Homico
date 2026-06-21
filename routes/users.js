const express=require("express");
const router=express.Router(); 
const User=require('../model/user');
 
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



module.exports=router;