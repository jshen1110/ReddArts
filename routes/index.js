var express       = require("express"),
	passport      = require("passport"),
	User          = require("../models/user"),
	router        = express.Router();

//  ===========
//  ROOT ROUTES
//  ===========

// render to home page
router.get("/", function(req, res){
	res.render("landing");
});
// render to my island page
router.get("/island", function(req, res){
	res.render("island");
});

//  ===========
//  AUTH ROUTES
//  ===========

// SHOW - REGISTER
router.get("/register", function(req, res){
   res.render("register"); 
});

// REGISTER - logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === '2020') {
		newUser.isAdmin = true;
    }
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
        }
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed up! Nice to meet you! " + user.body.username);
			res.redirect("/arts"); 
		});
	});
});

// SHOW - LOGIN
router.get("/login", function(req, res){
   res.render("login"); 
});

// LOGIN - logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/arts",
	failureRedirect: "/login",
	failureFlash: true,
	successFlash: 'Welcome Back'
	}), function(req, res){
});

// LOGOUT - logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "See You Next Time!");
	res.redirect("/arts");
});


module.exports = router;
