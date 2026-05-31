// this fiile is used to store dummy-data in data base-> pahle se data kuch hai aur vo
//  datad base me store krke use apni app me use krege taki crud opertion perfrom kr ske  aur
//step-1-      ek foder bamo ,use ek file bano sara data useme store kro
//step-2-      is file me data ko database me store krne ke liye code likho
//step 3- schema pahle define kr rakaha hai to vo file bhi import kro yaha ---> listing file me hai schema 
const mongoose = require('mongoose');
const initdata = require('./data.js');
const listing = require("../model/listing.js");

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
const initDB = async () => {  //saving data to the database
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);


    console.log("Data saved to MongoDb");
}
initDB();              //calling the function to save data to the database
