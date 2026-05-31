const mongoose=require('mongoose');
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
    }, 
     image: {
    filename: {
      type: String,
      default: "listingimage",
    },

    url: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxntFMeSDc-mNDJEglDYDKA8GvGzgsawSTcA&s",
    },
  },
   
    country:{
        type:String,    
    },
    });

const listing=mongoose.model("Listing",listingSchema);
module.exports=listing;