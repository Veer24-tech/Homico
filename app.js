const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing=require('./model/listing');
const path = require('path');
// for using ejs template engine set the view engine to ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
// for using static files like css and js files set the static folder to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended:true}));//iska use krte hai  data ko parse krne ke liye jo form 
                                            // se aata hai ;ya fir jaise id niklane ke loiye --- let {id}=req.params;
const port = 8080;

//connecting to mongodb
const MONGO_URL = 'mongodb://127.0.0.1:27017/Homico';
main()
.then(()=>{
    console.log(`Connected to MongoDB`);
}).catch((err)=>{
    console.log(`Error connecting to MongoDB: ${err}`);
})
async function main(){
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

 app.get("/listings", async(req,res)=>{
  let allListings = await listing.find({});
 res.render("Listings/index.ejs",{allListings});

 });

  //new route
 app.get("/listings/new" ,(req,res)=>{
  res.render("Listings/new.ejs");
 })


 //show route
 app.get("/listings/:id", async(req,res)=>{
    let {id}=req.params;
    let listingDetails=await listing.findById(id);
    res.render("Listings/show.ejs",{listingDetails});
 })
 // post rote for saving data of form in database
 app.post("/listings",async(req,res)=>{
//method 1- let{title,description,price,country,location}=req.body.listing;
    //  method 2-> let listing=req.body.listing;    pr iske liye form me name me aise likna hoga listing[title],listing[description] etc  
// method 3-> directly create a new listing object and save it in the database
const newListing= new listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
 
 })

 //edit route
 app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listingDetails=await listings.findById(id);
    res.render("Listings/edit.ejs",{listingDetails});
 })

app.listen(port, () => {
    console.log(`Server is ruuning on port ${port}`);
})