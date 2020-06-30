var mongoose    = require("mongoose"),
	Comment     = require("./comment");;


var artSchema = new mongoose.Schema({
	name: String,
	image: String,
	info: String,
	museum: String,
	museumimage: String,
	location: String,
	lat: Number,
	lng: Number,
	ticket: Number,
	createdAt :{
		type: Date, 
		default: Date.now
	},
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
	},
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

artSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});

module.exports = mongoose.model("Art", artSchema);