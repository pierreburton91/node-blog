var User = require('../models/user');
var Article = require('../models/article');

module.exports = function(app, passport, request, upload, imgurID) {

//########################
// Back office pages
//########################
	app.get('/', isLoggedIn, function (req, res) {
		res.render('dashboard', {user: req.user, articles: [], subscribers: []});
	});

	// Login
	app.get('/login', function (req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
	});
	
	// New user creation
	app.get('/create-user', isLoggedIn, function (req, res) {
		if(req.user.account.username == process.env.ADMIN_CREDS) {
			res.render('create-user', { message: req.flash('signupMessage') });
		}
		else {
			res.redirect('/login');
		}

	});

	// User settings screen
	app.get('/settings', isLoggedIn, function (req, res) {
		res.render('create-user', { user: req.user, message: req.flash('signupMessage') });
	});

	// Publishing
	app.get('/write-post', isLoggedIn, function (req, res) {
		const user = req.user;
		res.render('editor', {user: user});
	});

	app.get('/edit/:article', isLoggedIn, function(req, res) {
		const articleID = req.params.article;
		const user = req.user;
		// TODO: Finir le block
		Article.findById(articleID)
		res.render('editor', {user: user, article: article});
	});


//########################
// API
//########################
	app.post('/api/check-credentials', passport.authenticate('local-login'), function(req, res) {
	    // Generate a JSON response reflecting authentication status
	    if (!req.user) {
	      return res.send({ success : false, message : 'Try again.' });
	    }
	    
	    return res.send({ success : true, message : 'Logged in successfully !' });
	});

	app.post('/api/signup', passport.authenticate('local-signup'), function(req, res) {
	    // Generate a JSON response reflecting authentication status
	    if (!req.user) {
	      return res.send({ success : false, message : 'Try again.' });
	    }
	    
	    return res.send({ success : true, message : 'User is now in the database.' });
	});

	app.put('/api/update-profile', function(req, res) {
		const data = req.body;
		
		User.findById(req.user.id, function(err, user) {
			user.account.username = data.account.username;
			if (data.account.password != '') {
				const newPassword = user.generateHash(data.account.password);
				user.account.password = newPassword;
			}
			user.about.firstname = data.about.firstname;
			user.about.lastname = data.about.lastname;
			user.about.picture = data.about.picture;
			user.about.email = data.about.email;
			user.about.description = data.about.description;
			user.about.social.facebook = data.about.social.facebook;
			user.about.social.twitter = data.about.social.twitter;
			user.about.social.google = data.about.social.google;
			user.about.social.instagram = data.about.social.instagram;
			user.about.social.pinterest = data.about.social.pinterest;
			user.about.social.youtube = data.about.social.youtube;
			user.about.social.vimeo = data.about.social.vimeo;
			user.about.social.medium = data.about.social.medium;
			user.about.social.github = data.about.social.github;
			user.about.social.dribbble = data.about.social.dribbble;
			user.about.social.behance = data.about.social.behance;
			user.blog.name = data.blog.name;
			user.blog.url = data.blog.url;
			user.blog.logo = data.blog.logo;
			user.blog.catchphrase = data.blog.catchphrase;
			user.blog.categories = data.blog.categories;
			user.blog.social.facebook = data.blog.social.facebook;
			user.blog.social.twitter = data.blog.social.twitter;
			user.blog.social.google = data.blog.social.google;
			user.blog.social.instagram = data.blog.social.instagram;
			user.blog.social.pinterest = data.blog.social.pinterest;
			user.blog.social.youtube = data.blog.social.youtube;
			user.blog.social.vimeo = data.blog.social.vimeo;
			user.blog.social.medium = data.blog.social.medium;
			user.blog.social.github = data.blog.social.github;
			user.blog.social.dribbble = data.blog.social.dribbble;
			user.blog.social.behance = data.blog.social.behance;
			
			user.save();

			if (err)
				return res.send({success : false, message : 'An error occured'});

			else 
				return res.send({success : true, message : 'User updated'});
		});	
	});

	app.post('/api/publish', function(req, res) {
		const data = req.body;
		const userId = req.user.id;

		let newArticle = new Article();

		newArticle.authorID = userId;
		newArticle.isDraft = false;
		newArticle.headline = data.headline;
		newArticle.datepublished = data.dateNow;
		newArticle.dateModified = '';
		newArticle.about.name = data.about.name;
		newArticle.about.url = data.about.url;
		newArticle.category = data.category;
		newArticle.keywords = data.keywords;
		newArticle.thumbnail = data.thumbnail;
		newArticle.fullBody = data.fullBody;
		newArticle.bodyString = data.bodyString;
		newArticle.markdown = data.markdown;
		newArticle.wordCount = data.wordCount;
		newArticle.comments = [];
		newArticle.likes = [];
		newArticle.viewCount = 0;

		newArticle.save(err => {
			if (err)
				return res.send({success : false, message : 'An error occured'});

			else 
				return res.send({success : true, message : 'Article published !'});
		});
	});

	app.post('/api/save-new-draft', function(req, res) {
		const data = req.body;
		const userId = req.user.id;

		let newArticleDraft = new Article();

		newArticleDraft.authorID = userId;
		newArticleDraft.isDraft = true;
		newArticleDraft.headline = data.headline;
		newArticleDraft.datepublished = '';
		newArticleDraft.dateModified = '';
		newArticleDraft.about.name = data.about.name;
		newArticleDraft.about.url = data.about.url;
		newArticleDraft.category = data.category;
		newArticleDraft.keywords = data.keywords;
		newArticleDraft.thumbnail = data.thumbnail;
		newArticleDraft.fullBody = data.fullBody;
		newArticleDraft.bodyString = data.bodyString;
		newArticleDraft.markdown = data.markdown;
		newArticleDraft.wordCount = data.wordCount;
		newArticleDraft.comments = [];
		newArticleDraft.likes = [];
		newArticleDraft.viewCount = 0;

		newArticleDraft.save(err => {
			if (err)
				return res.send({success : false, message : 'An error occured'});

			else 
				return res.send({success : true, idToReload : newArticleDraft.id, message : 'Draft saved !'});
		});
	});

	app.put('/api/update-and-publish/:articleID', function(req, res) {
		const data = req.body;
		const userId = req.user.id;
		const articleID = req.params.articleID;

		Article.findById(articleID, function(err, article) {
			
			article.authorID = userId;
			article.isDraft = false;
			article.headline = data.headline;
			if (article.datepublished == '') {
				article.datepublished = data.dateNow;
			} else {
				article.dateModified = data.dateNow;
			}
			article.about.name = data.about.name;
			article.about.url = data.about.url;
			article.category = data.category;
			article.keywords = data.keywords;
			article.thumbnail = data.thumbnail;
			article.fullBody = data.fullBody;
			article.bodyString = data.bodyString;
			article.markdown = data.markdown;
			article.wordCount = data.wordCount;

			article.save();

			if (err)
				return res.send({success : false, message : 'An error occured'});

			else 
				return res.send({success : true, message : 'Article updated and published !'});
		});
	});

	app.put('/api/update-draft/:articleID', function(req, res) {
		const data = req.body;
		const userId = req.user.id;
		const articleID = req.params.articleID;

		Article.findById(articleID, function(err, article) {
			
			article.authorID = userId;
			article.isDraft = true;
			article.headline = data.headline;
			article.about.name = data.about.name;
			article.about.url = data.about.url;
			article.category = data.category;
			article.keywords = data.keywords;
			article.thumbnail = data.thumbnail;
			article.fullBody = data.fullBody;
			article.bodyString = data.bodyString;
			article.markdown = data.markdown;
			article.wordCount = data.wordCount;

			article.save();

			if (err)
				return res.send({success : false, message : 'An error occured'});

			else 
				return res.send({success : true, message : 'Draft saved !'});
		});
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