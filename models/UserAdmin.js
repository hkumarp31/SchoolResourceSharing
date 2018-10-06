const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const UserAdminSchema = new mongoose.Schema({
	nname : String,
	adminemail : String,
	username : String,
	password : String
});
  
UserAdminSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model('useradmin',UserAdminSchema);