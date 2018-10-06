const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddPostSchema = new Schema({
	  availability:{
	  	type:String,
	  	default:''
	  },
	  title:{
	  	type:String,
	  	require:true
	  },
	  selectrange:{
	  	type:String,
	  	default : ''
	  },
	  ac:{
	  	type:Boolean,
	  	default:false
	  },
	  watersupply:{
	  	type:Boolean,
	  	default:false
	  },
	  stage:{
	  	type:Boolean,
	  	default:false
	  },
	  projector:{
	  	type:Boolean,
	  	default:false
	  },
	  description:{
	  	type:String,
	  	require:true
	  }
	 /* image:{
	  	type:Buffer,
	  	require:true
	  }*/
});
module.exports=mongoose.model('adminaddpostmodel',AddPostSchema);