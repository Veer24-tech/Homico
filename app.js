const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./model/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");

// for using ejs template engine set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// for using static files like css and js files set the static folder to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));//iska use krte hai  data ko parse krne ke liye jo form 
// se aata hai ;ya fir jaise id niklane ke loiye --- let {id}=req.params;
app.use(methodOverride("_method")); // for using put and delete reqm  in form we have to use method override
app.engine("ejs",ejsmate); // for using ejs mate layout in our project



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
    mongoose.connect(MONGO_URL);
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



app.get('/', (re, res) => {
    res.send(`App is working`);
})

app.get("/listings", async (req, res) => {
    let allListings = await listing.find({});
    res.render("Listings/index.ejs", { allListings });

});

//new route
app.get("/listings/new", (req, res) => {
    res.render("Listings/new.ejs");
})


//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listingDetails = await listing.findById(id);
    res.render("Listings/show.ejs", { listingDetails });
})


// post rote for saving data of form in database
app.post("/listings", async (req, res) => {
    //method 1- let{title,description,price,country,location}=req.body.listing;
    //  method 2-> let listing=req.body.listing;    pr iske liye form me name me aise likna hoga listing[title],listing[description] etc  
    // method 3-> directly create a new listing object and save it in the database
    const newListing = new listing(req.body.listing);
    await newListing.save();  // save the form data in the database
    res.redirect("/listings");

})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listingDetails = await listing.findById(id);
    res.render("Listings/edit.ejs", { listingDetails });
})


// saving the updated data  of listings in the database
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    //// req.body.listing me form ka sara updated data (title, description, price, etc.) object ke form me hota hai.
    // findByIdAndUpdate() ko ye object dekar database me matching fields update kar dete hain.

    await listing.findByIdAndUpdate(id, { ...req.body.listing });//{...req.body.listing} ka use krte hai kyuki req.body.listing me title,description,price,country,location sab hote hai to unko alag alag pass krne ke bajaye ...req.body.listing se sare data ko pass kr dete hai
    res.redirect(`/listings/${id}`);
})
//delete listing
app.delete("/listings/:id",async(req,res)=>{
let{id}=req.params;
let deletedListing=await listing.findByIdAndDelete(id);
console.log("deleted listing details",deletedListing.title);
res.redirect("/listings");
})


app.listen(port, () => {
    console.log(`Server is ruuning on port ${port}`);
})