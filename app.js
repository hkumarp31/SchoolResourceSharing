const express = require('express');
const bodyParser=require('body-parser');
const path = require('path');
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const routes = require('./routes/imagefile');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local');
const passport = require('passport');
//const session = require('express-session');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));


app.set('views','./views');
app.set('view engine','ejs');

app.use(methodOverride("_method"));

// Loading Models 

require('./models/AdminAddPost');
const madminaddpostmodel = mongoose.model('adminaddpostmodel');
require('./models/Booking');
const mbookingpostmodel = mongoose.model('bookingpostmodel');
require('./models/UserVisitor');
const muservisitor = mongoose.model('uservisitor');
require('./models/UserAdmin');
const museradmin = mongoose.model('useradmin');


// Mongoose Promise , connecting database

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://hemant:hemant12@ds141942.mlab.com:41942/schoolresource',{ useNewUrlParser: true })
.then(()=>{
	console.log('mongo connected') 
})
.catch(err => console.log(err));

// Passport Configuration

app.use(require("express-session")({
	secret : "thisismysecret",
	resave:false,
	saveUninitialized:false
}));
//app.use(session({secret:'anything'}));
app.use(passport.initialize());
app.use(passport.session());

//Visitor Users
passport.use(new LocalStrategy(muservisitor.authenticate()));
passport.serializeUser(muservisitor.serializeUser());
passport.deserializeUser(muservisitor.deserializeUser());
//Admin Users

/*
passport.use(new LocalStrategy(museradmin.authenticate()));
passport.use(museradmin.createStrategy());
passport.serializeUser(museradmin.serializeUser());
passport.deserializeUser(museradmin.deserializeUser());
*/
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});


app.get('/',function(req,res){
	console.log(req.user);
	muservisitor.find({},function(err,uservisitor){
		if(err){
			console.log(err);
		}
		else{
			res.render('index',{muservisitor:muservisitor,currentUser : req.user});
		}
	});
	
});





app.get('/admin/new', isLoggedIn, function(req,res){
			res.render('adminaddpost');
});


app.post('/addpost', (req, res) => {

	let acstatus;
	if(req.body.ac){
		acstatus=true;
	}
	else acstatus=false;

	let waterstatus;
	if(req.body.watersupply){
		waterstatus=true;
	}
	else waterstatus=false;

	let stagestatus;
	if(req.body.stage){
		stagestatus=true;
	}
	else stagestatus=false;

	let projectorstatus;
	if(req.body.projector){
		projectorstatus=true;
	}
	else projectorstatus=false;

	const newAdminpost = {
		availability:req.body.availability,
		title:req.body.title,
		selectrange:req.body.selectrange,
		ac:acstatus,
		watersupply:waterstatus,
		stage:stagestatus,
		projector:projectorstatus,
		description:req.body.description
	//	image:req.body.image
	}
	new madminaddpostmodel(newAdminpost).save().then(adminaddpostmodel =>{
		res.redirect('/admin/post');
	})

});


// admin show all posts
app.get('/admin/post',isLoggedIn,function(req,res){
	madminaddpostmodel.find({}).then(adminaddpostmodel=>{
		res.render('adminpost',{adminaddpostmodel:adminaddpostmodel})
	})
})

// visitor show all post
app.get('/visitor/post',function(req,res){
	madminaddpostmodel.find({}).then(adminaddpostmodel=>{
		res.render('visitorpost',{
			adminaddpostmodel:adminaddpostmodel
		})
	})
})



//Admin Show Single Post
app.get('/admin/post/:id',isLoggedIn,function(req,res){

	madminaddpostmodel.findById(req.params.id,function(err, adminaddpostmodel){
		if(err){ console.log(err);}
		else { 
				res.render('adminshowpost',{adminaddpostmodel : adminaddpostmodel});
		  }
	})
});

// Visitor show single post
app.get('/visitor/post/:id',function(req,res){

	madminaddpostmodel.findById(req.params.id,function(err, adminaddpostmodel){
		if(err){ console.log(err);}
		else { 
				res.render('visitorshowpost',{adminaddpostmodel : adminaddpostmodel});
		  }
	})
});

// Admin Fetch Data to edit post
app.get('/admin/post/:id/edit',isLoggedIn,function(req,res){
	madminaddpostmodel.findById(req.params.id,function(err, adminaddpostmodel){
		if(err){ console.log(err);}
		else { 
				res.render('admineditpost',{adminaddpostmodel : adminaddpostmodel});
		  }
	})
});

// Admin Update Data
app.put('/admin/post/:id',isLoggedIn,function(req,res){

let acstatus;
	if(req.body.ac){
		acstatus=true;
	}
	else acstatus=false;

	let waterstatus;
	if(req.body.watersupply){
		waterstatus=true;
	}
	else waterstatus=false;

	let stagestatus;
	if(req.body.stage){
		stagestatus=true;
	}
	else stagestatus=false;

	let projectorstatus;
	if(req.body.projector){
		projectorstatus=true;
	}
	else projectorstatus=false;

	const newAdminpost = {
		availability:req.body.availability,
		title:req.body.title,
		selectrange:req.body.selectrange,
		ac:acstatus,
		watersupply:waterstatus,
		stage:stagestatus,
		projector:projectorstatus,
		description:req.body.description
	//	image:req.body.image
	}

	madminaddpostmodel.findByIdAndUpdate(req.params.id,newAdminpost, function(err,adminaddpostmodel){
		if(err)
		{
			res.redirect("/admin/post");
		}
		else{
			res.redirect("/admin/post/"+req.params.id);
		}
	})
})


// Admin Delete Post
app.delete('/admin/post/:id',isLoggedIn,function(req,res){
	madminaddpostmodel.findByIdAndRemove(req.params.id,function(err){
		if(err){
		 		res.redirect("/admin/post/"+req.params.id);
			}
		else { 
				res.redirect("/admin/post");
		  }
	})

});

//Visitor Post Booking Fetch Details
app.get('/visitor/post/:id/booking',isLoggedIn, function(req,res){
	madminaddpostmodel.findById(req.params.id,function(err, adminaddpostmodel){
			if(err){ console.log(err);}
			else { 
					res.render('visitorpostbook',{adminaddpostmodel : adminaddpostmodel});
			  }
	})
});


// Visitor Post Booking Send visitors Details
app.post('/booking',isLoggedIn, function(req,res){

	const newBookingpost = {
		yourrange:req.body.yourrange,
		title:req.body.title,
		postid:req.body.postid,
		fromdate:req.body.fromdate,
		todate:req.body.todate,
		purpose:req.body.purpose
	//	image:req.body.image
	}
	new mbookingpostmodel(newBookingpost).save().then(bookingpostmodel =>{
		res.redirect('/visitor/post');
	})
})


// Admin Post Booking Received for permission

app.get('/admin/booking',isLoggedIn,function(req,res){
	mbookingpostmodel.find({}).then(bookingpostmodel=>{
		res.render('adminpostbooking',{
			bookingpostmodel:bookingpostmodel
		})
	})
})





// For Contact Us
require('./models/ContactUs');
const mcontactus = mongoose.model('contactusmodel');

app.get('/visitor/contactus',function(req,res){
	res.render('contactus');
});

app.post('/contact', (req, res) => {
	const newContact = {
		name:req.body.name,
		email:req.body.email,
		textmessage:req.body.textmessage,
	//	image:req.body.image
	}
	new mcontactus(newContact).save().then(contactusmodel =>{
		res.redirect('/admin/message');
	})
});


//For Admin Message Reading or Fetching Contactus Messages
app.get('/admin/message',isLoggedIn,function(req,res){
	mcontactus.find({}).then(contactusmodel=>{
		res.render('adminmessage',{
			contactusmodel:contactusmodel
		})
	})
})



// Authentication
//For New Registration
app.get('/visitor/registration',function(req,res){
	res.render('register');
});

app.post('/register',(req,res) =>{
	var newuservisitor = new muservisitor({
		username : req.body.username,
		email : req.body.email,
		name : req.body.name
	});
	muservisitor.register(newuservisitor, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect('/');
		})
	})
});


//For Login of User
app.get('/visitor/loginform',function(req,res){
	res.render('login');
});

app.post("/login",passport.authenticate("local",
	{	successRedirect : "/",
		failureRedirect:"/visitor/loginform"
	}), function(req,res){
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
})
/*
//Authentication
// For Admin User
app.get('/admin/admin/adminregister',function(req,res){
			res.render('adminregister');
});

app.post('/adminregister',(req,res) =>{
	var newuseradmin = new museradmin({
		username : req.body.username,
		adminemail : req.body.adminemail,
		adminname : req.body.adminname
	});
	museradmin.register(newuseradmin, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render('adminregister');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect('/admin/new');
		})
	})
});

app.get('/admin/admin/adminlogin',function(req,res){
			res.render('adminlogin');
});
app.post("/adminlogin",passport.authenticate("local",
	{	successRedirect : "/admin/new",
		failureRedirect:"/admin/admin/adminlogin"
	}), function(req,res){
});

*/


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/visitor/loginform");
}
/*function isAdminLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/admin/admin/adminlogin");
}
*/



app.listen(3000,()=>{
	console.log('Server Started on 3000');
})































// Code to upload images
/*
mongoose.connect('mongodb://hemant:hemant12@ds141942.mlab.com:41942/schoolresource',{ useNewUrlParser: true });

app.use('/',routes);

app.get('/images', function(req, res) {
//calling the function from index.js class using routes object..
	routes.getImages(function(err, genres) {
		if (err) {
		throw err;
		}
		res.json(genres);
	});
});
 
// URL : http://localhost:3000/images/(give you collectionID)
// To get the single image/File using id from the MongoDB
app.get('/images/:id', function(req, res) {
 
//calling the function from index.js class using routes object..
routes.getImageById(req.params.id, function(err, genres) {
	if (err) {
	throw err;
	}
	//res.download(genres.path);
	res.send(genres.path)
	});
});
 
app.listen(3000,()=>{
	console.log('Running on port 3000');
});
 */





/*var db
MongoClient.connect('mongodb://hemant:hemant12@ds141942.mlab.com:41942/schoolresource',{ useNewUrlParser: true },(err,client)=>{
	if(err) return console.log(err)
		db=client.db('schoolresource')
	app.listen(3000,()=>{
		console.log('listening on 3000')
	})
})

app.post('/contact', (req, res) => {
	db.collection('contact').save(req.body,(err,result)=>{
		if(err) return console.log(err)
	console.log('saved to database')
  	console.log(req.body)
  	 res.redirect('go');
	})
});
app.get('/go',function(req,res){
	db.collection('contact').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('go.ejs', {contact: result});
	})

})
app.get('/index',function(req,res){
	res.render('index');
})
*/