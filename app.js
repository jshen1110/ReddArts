require('dotenv').config();

var express         = require("express"),
	app             = express(),
	bodyParser      = require("body-parser"),
	mongoose        = require("mongoose"),
	Schema          = mongoose.Schema,
	flash           = require("connect-flash"),
	passport        = require("passport"),
	LocalStrategy   = require("passport-local"),
	methodOverride  = require("method-override"),
	Art             = require("./models/art"),
	Comment         = require("./models/comment"),
	User            = require("./models/user"),
	seedDB          = require("./seed"),
	path            = require('path');

var artRoutes        = require("./routes/arts"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index"); //authRoutes

const baguetteBox = require('baguettebox.js');

// make goorm ver loacl db
mongoose.connect("mongodb://localhost:27017/ac_museum", {useNewUrlParser: true, useUnifiedTopology: true});
// deploy ver using mongodb

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash()); // MUST before passport configuration
seedDB();


// add moment js function
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CURRENT USER & FLASH
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// ROUTE
app.use("/", indexRoutes);
app.use("/arts", artRoutes);
app.use("/arts/:id/comments", commentRoutes);

app.listen(3000, process.env.IP, function(){
   console.log("The AC Museum Server Has Started!");
});
