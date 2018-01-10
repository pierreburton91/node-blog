module.exports = function(app, passport, request, upload, imgurID) {


	app.get('/', function (req, res) {
		res.render('dashboard', {user: req.user, articles: []});
	});


	// Login
	app.get('/login', function (req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	app.post('/api/check-credentials', function(req, res) {
		var credentials = req.body;

		res.send(true);
	});

	app.get('/logoff', function(req, res) {
        req.logout();
        res.redirect('/login');
    });


	// Signup
	app.get('/create-user/:admin', function (req, res) {
		if(req.params.admin == "Vertigo5100" || req.params.admin == process.env.ADMIN_CREDS) {
			res.render('create-user', { message: req.flash('signupMessage') });
		}
		else {
			res.redirect('/login');
		}

	});
	app.post('/api/signup', passport.authenticate('local-signup'), function(req, res) {
	    // Generate a JSON response reflecting authentication status
	    if (!req.user) {
	      return res.send({ success : false, message : 'Operation failed!' });
	    }
	    
	    return res.send({ success : true, message : 'Operation succeeded!' });
	});


	// Publishing
	app.get('/write-post', function (req, res) {
		res.render('editor');
	});

	
	// Utilities API
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