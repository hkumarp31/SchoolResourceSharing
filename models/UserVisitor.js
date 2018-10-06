const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
	name : String,
	email : String,
	username : String,
	password : String
});
  
UserSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('uservisitor',UserSchema);