const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingPost = new Schema({
	  postid:{
	  	type:String,
	  	require:true
	  },
	  title:{
	  	type:String,
	  	require:true
	  },
	  purpose:{
	  	type:String,
	  	require:true
	  },
	  fromdate:{
	  	type:String,
	  	require:true
	  },
	  todate:{
	  	type:String,
	  	require:true
	  },
	  yourrange:{
	  	type:String,
	  	require:true
	  }
	 /* image:{
	  	type:Buffer,
	  	require:true
	  }*/
});
module.exports=mongoose.model('bookingpostmodel',BookingPost);