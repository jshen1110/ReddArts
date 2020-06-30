var Art             = require("../models/art"),
	Comment         = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkArtOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Art.findById(req.params.id, function(err, foundArt){
			if(err || !foundArt) {
				req.flash("error", "Art not found");
				res.redirect("back");
			} else {
				if (!foundArt) {
					req.flash("error", "Item not found.");
					return res.redirect("back");
				}
				// does user own the art 
				if(foundArt.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "No permission.");
					console.log("Check failed");
					res.redirect("back");
				}
			}
		})
	}else {
		req.flash("error", "You need to be signed in to do that!");
		res.redirect("back");
	}
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				if (!foundComment) {
					req.flash("error", "Item not found.");
					return res.redirect("back");
				}
				// does user own the comment 
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {  
					next();
				} else {
					req.flash("error", "No permission.");
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("error", "You need to be signed in to do that!");
		res.redirect("back");
	}
};
middlewareObj.isAdmin = function(req, res, next){
	if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be signed in to do that!");
	res.redirect("/login");
};

module.exports = middlewareObj;