const express = require('express');
const multer = require('multer');
const http = require('https');
const request = require('request');
const upload = multer();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const imgurID = "c6a8ce7a6f9c704";

/* Middlewares */
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json



/* Routes */
app.get('/', function (req, res) {
	res.render('dashboard', { title: 'Hey', message: 'Hello there!', link: 'Go to test', link2: 'test'});
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.get('/write-post', function (req, res) {
	res.render('editor');
});

app.post('/api/check-credentials', function(req, res) {
	var credentials = req.body;

	res.send(credentials);
});

app.post('/api/upload-image', upload.single('file'), function(req, res) {
	var file = req.file;
	var imgurUploadOptions = {
		"method": "POST",
	  	"url": "https://api.imgur.com/3/image",
	  	"formData": {"image": file.buffer.toString('base64')},
	  	"headers": {
	    	"authorization": "Client-ID "+ imgurID +""
	  	}
	};
	request(imgurUploadOptions, function(error, response, body) {
		if (error) {
			res.send(error);
			return;
		}
  		res.send(body);
	});
});



/* 3, 2, 1, Launch ! */
app.listen(3000, function() {
	console.log('App is up and running on 3000!');
})