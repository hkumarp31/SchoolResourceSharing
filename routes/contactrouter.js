const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

require('../models/ContactUs');
const mcontactus = mongoose.model('contactusmodel');

router.get('/',function(req,res){
	res.render('contactus');
});


router.post('/contact',(req, res)=>{
	const newContact = {
		name:req.body.name,
		email:req.body.email,
		textmessage:req.body.textmessage,
	//	image:req.body.image
	}
	new mcontactus(newContact).save().then(contactusmodel =>{
		res.redirect('/');
	})

});

router.get('/go',function(req,res){
	mcontactus.find({}).then(contactusmodel=>{
		res.render('go',{
			contactusmodel:contactusmodel
		})
	})
})

module.exports = router;