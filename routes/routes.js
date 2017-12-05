module.exports = function(app, passport, upload, imgurID) {


	app.get('/', function (req, res) {
		res.render('dashboard', {articles: []});
	});

	app.get('/login', function (req, res) {
		res.render('login');
	});

	app.get('/create-user/:admin', function (req, res) {
		if(req.params.admin == "Vertigo5100" || req.params.admin == process.env.ADMIN_CREDS) {
			res.render('create-user');
		}
		else {
			res.redirect('/login');
		}

	});

	app.get('/write-post', function (req, res) {
		res.render('editor');
	});

	app.post('/api/check-credentials', function(req, res) {
		var credentials = req.body;

		res.send(true);
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

}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the login page
    res.redirect('/login');
}