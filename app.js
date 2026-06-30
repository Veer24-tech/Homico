if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

// console.log(process.env.SECRET)

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./model/listing');
const review=require('./model/review');
const User=require('./model/user');
const path = require('path');
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const{listingSchema}=require("./schema");
const { wrap } = require('module');

const listingRouter=require("./routes/listings");  // listings  routesssss
const reviewsRouter=require("./routes/reviews");   //  reviews routeeeee
const userRouter=require("./routes/users");   //  users routeeeee
const session=require('express-session');
const flash=require('connect-flash');
//   authentication & autorization 
const passport=require('passport');
const LocalStrategy=require('passport-local');



// for using ejs template engine set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// for using static files like css and js files set the static folder to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));//iska use krte hai  data ko parse krne ke liye jo form 
// se aata hai ;ya fir jaise id niklane ke loiye --- let {id}=req.params;
app.use(methodOverride("_method")); // for using put and delete reqm  in form we have to use method override
app.engine("ejs", ejsmate); // for using ejs mate layout in our project



const port = 8080;

//connecting to mongodb
const MONGO_URL = 'mongodb://127.0.0.1:27017/Homico';
main()
    .then(() => {
        console.log(`Connected to MongoDB`);
    }).catch((err) => {
        console.log(`Error connecting to MongoDB: ${err}`);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}


//testing that data is being stored in the database or not
//     app.get("/Listing", async(req,res)=>{
//     let listing = new Listing({
//         title:"Title test",
//         description:"Description test",
//         price:100,  
//         country:"india",
//         location:"Delhi",
//     })
//     await listing.save();
//     console.log(listing,"listing data is saved in the database");
//     res.send("Listing data is saved in the database");

// })





app.get('/', (req, res) => {
    res.send(`App is working`);
})

// session options
const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
       }
}

//using sessions---->
app.use(session(sessionOptions));
app.use(flash());
// autentication & authorization
app.use(passport.initialize());
app.use(passport.session());

passport.use(new  LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/// demo user
app.get("/demoUser", async (req, res) => {
    
        let fakeUser = new User({
            email: "abc@gmail.com",
            username: "Sewcuriy09twy",
        });

        let registeredUser = await User.register(fakeUser, "password");
        console.log(registeredUser);

        res.send(registeredUser);
    
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();

});
// using all routes ----

app.use("/listings",listingRouter);////   uses listing routes---
app.use("/listings/:id/reviews",reviewsRouter); // uses imported reviews 
app.use("/",userRouter); // signup 




// random route errrr----
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error occured!" } = err;
    res.status(statusCode).render("Listings/error.ejs", { message });

    // res.status(statusCode).send(message);


});



app.listen(port, () => {
    console.log(`Server is ruuning on port ${port}`);
})