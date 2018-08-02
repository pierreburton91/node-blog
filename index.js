const express = require('express');
const multer = require('multer');
const http = require('https');
const request = require('request');
const upload = multer();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const flash = require('flash');
const passport = require('passport');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const imgurID = "c6a8ce7a6f9c704";
const app = express();


const configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useMongoClient: true }); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

/* Middlewares */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// required for passport
app.use(session({
	store: new MemoryStore({
		checkPeriod: 86400000 // Removes expired entries every 24h
	}),
	secret: 'nodejscmsforthewinfuckwordpress',
	resave: true,
	saveUninitialized: false 
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

/* Routes */
require('./routes/routes.js')(app, passport, request, upload, imgurID);

/* 3, 2, 1, Launch ! */
app.listen(process.env.PORT || 3000, function() {
	console.log('App is up and running!');
})