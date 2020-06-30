var express       = require("express"),
    Art           = require("../models/art"),
	middleware    = require("../middleware"),
	NodeGeocoder  = require('node-geocoder'),
	Comment       = require("../models/comment");
var	router        = express.Router();

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

/*======================================================
                    FUNCTIONS
=======================================================*/


// ====================
// ARTS ROUTES
// ====================

// INDEX - show all arts
router.get("/", function(req, res){
	Art.find({}, function(err, allArts){
		if(err){
			console.log(err);
		}else{
			res.render("arts/index", {arts:allArts});
		}
	});
});


// CREATE - new art & show & save to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// Get all arts from db
	var name = req.body.name;
	var image = req.body.image;
	var info = req.body.info;
	var museum = req.body.museum;
	var ticket = req.body.ticket;
	var museumimage = req.body.museumimage;
	var author = {
		id: req.user._id,
        username: req.user.username
    }
	geocoder.geocode(req.body.location, function (err, data) {
		var lat = data[0].latitude;
		var lng = data[0].longitude;
		var location = data[0].formattedAddress;
		var newArt = {name:name, image:image, info:info, museum:museum, location: location, lat: lat, lng: lng, ticket:ticket, museumimage:museumimage, author:author};
		// Create a new Art & save to DB
		Art.create(newArt, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else{
				console.log(newlyCreated);
				res.redirect("/arts");
			}
		});
	});
});

// NEW - create new art
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("arts/new"); 
});

// SHOW - shows more info about one art
router.get("/:id", function(req, res){
    //find the art page with provided ID
	Art.findById(req.params.id).populate("comments likes").exec(function(err, foundArt){
        if(err || !foundArt){
            console.log(err);
			req.flash("error", "Item not found.");
			return res.redirect("/arts");
        } else{
			console.log(foundArt);
			//render show template with that art
			res.render("arts/show", {art: foundArt});
		}
    });
});

// Art Like Route
router.post("/:id/like", middleware.isLoggedIn, function (req, res) {
    Art.findById(req.params.id, function (err, foundArt) {
        if (err) {
            console.log(err);
            return res.redirect("/arts");
        }
        // check if req.user._id exists in foundArt.likes
        var foundUserLike = foundArt.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundArt.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundArt.likes.push(req.user);
        }

        foundArt.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/arts");
            }
            return res.redirect("/arts/" + foundArt._id);
        });
    });
});

// EDIT
router.get("/:id/edit", middleware.checkArtOwnership, function(req, res){
    Art.findById(req.params.id, function(err, foundArt){
		res.render("arts/edit", {art: foundArt});
    });
});

// UPDATE
router.put("/:id", middleware.checkArtOwnership, function(req, res){
	geocoder.geocode(req.body.location, function (err, data) {
		if (err || !data.length) {
			console.log(err);
			req.flash('error', 'Invalid address');
			res.redirect("back");
		}
		
		req.body.art.lat = data[0].latitude;
		req.body.art.lng = data[0].longitude;
		req.body.art.location = data[0].formattedAddress;
		
		Art.findByIdAndUpdate(req.params.id, req.body.art, function(err, art){
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			} else {
				req.flash("success","Successfully Updated!");
				res.redirect("/arts/" + art._id);
			}
		});
	});
});


// DELETE
router.delete("/:id", middleware.checkArtOwnership, function(req, res){
	Art.findByIdAndRemove(req.params.id, async function(err, campground){
		if(err){
			res.redirect("/arts");
		} else {
			try {
				let foundArt = await Art.findById(req.params.id);
				await foundArt.remove();
				res.redirect("/arts");
			} catch(err) {
				if(err) {
					req.flash("error", err.message);
					return res.redirect("back");
				}
			}
		}
	});
});

module.exports = router;