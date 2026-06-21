const mongoose=require('mongoose');
let passportLocalMongoose=require("passport-local-mongoose").default;
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{
        type:String ,
        required:true,
    }
})
// console.log(passportLocalMongoose);
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",UserSchema);
