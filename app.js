const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./model/listing');
const review=require('./model/review');
const path = require('path');
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const{listingSchema}=require("./schema");
const { wrap } = require('module');

const listing=require("./routes/listings");  // listings  routesssss
const reviews=require("./routes/reviews");   //  reviews routeeeee

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

// using all routes ----

app.use("/listings",listing);////   uses listing routes---
app.use("/listings/:id/reviews",reviews); // uses imported reviews 



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