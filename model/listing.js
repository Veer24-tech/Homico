const mongoose=require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;

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
   reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Reviews",
   }],
   owner:{
    type:Schema.Types.ObjectId,
    ref:'User',
   },
   geometry:{
     type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }

   }

   
    });

    //  mongoose middlewares for handling deletion (post delete ho to uske reviews bhi dlt ho jaye );
    listingSchema.post("findOneAndDelete",async(listing)=>{
        if(listing){
               await review.deleteMany({_id:{$in :listing.reviews}});
        }
     
    })

const listing=mongoose.model("Listing",listingSchema);
module.exports=listing;