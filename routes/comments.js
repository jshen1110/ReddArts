var express       = require("express"),
	router        = express.Router({mergeParams: true}),
    Art           = require("../models/art"),
	Comment       = require("../models/comment"),
	middleware    = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

// NEW - COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
	// find art by id
	console.log(req.params.id);
	Art.findById(req.params.id, function(err, art){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {art: art});
		}
	})
});


// CREATE - new comment & connect to art & redirect
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup art using ID
	Art.findById(req.params.id, function(err, art){
		if(err){
			console.log(err);
			res.redirect("/arts");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comments
					comment.save();
					art.comments.push(comment);
					art.save();
					console.log(comment);
					req.flash("success", "Successfully added comment");
					res.redirect('/arts/' + art._id);
				}
			});
		}
	});
});

// EDIT - COMMENT  
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, Comment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {art_id: req.params.id, comment: Comment});
		}
	});
});

// UPDATE - COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("edit");
		} else {
			req.flash("success", "Successfully updated a comment.");
			res.redirect("/arts/" + req.params.id );
		}
	});
});

// DELETE - COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/arts/" + req.params.id);
		}
	});
});

module.exports = router;