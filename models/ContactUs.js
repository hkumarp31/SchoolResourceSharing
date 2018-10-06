const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.connect('mongodb://hemant:hemant12@ds141942.mlab.com:41942/schoolresource',{ useNewUrlParser: true });

const ContactSchema = new Schema({
	  name:{
	  	type:String,
	  	require:true
	  },
	  email:{
	  	type:String,
	  	require:true
	  },
	  textmessage:{
	  	type:String,
	  	require:true
	  }
	 /* image:{
	  	type:Buffer,
	  	require:true
	  }*/
});
module.exports=mongoose.model('contactusmodel',ContactSchema);