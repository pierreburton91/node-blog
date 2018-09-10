var mongoose = require('mongoose');
var csv = require('csv-express');
var User = require('../models/user');
var Article = require('../models/article');
var Subscriber = require('../models/subscriber');

module.exports = function (app, passport, request, upload, imgurID) {

//########################
// Back office pages
//########################
	app.get('/', isLoggedIn, async function (req, res) {
		const user = req.user;
		let response = {};

		await Article.find({authorID: user.id}, '_id headline category datePublished dateModified viewCount likes comments', function (err, articles) {
			if (err) {
				console.log(err);
				throw err;
			}
			return response.articles = articles;
		});
		await Subscriber.find({relatedUserId: user.id}, function (err, subscribers) {
			if (err) {
				console.log(err);
				throw err;
			}
			return response.subscribers = subscribers;
		});
		return res.render('dashboard', {user: user, articles: response.articles, subscribers: response.subscribers});
	});

	// Login
	app.get('/login', function (req, res) {
		res.render('login', { message: req.flash('loginMessage') });
	});

	app.get('/logout', function (req, res) {
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

	app.get('/edit/:article', isLoggedIn, function (req, res) {
		const articleID = req.params.article;
		const user = req.user;
		Article.findById(articleID, function (err, article) {
			if (err) {
				console.log(err);
				throw err;
			}

			return res.render('editor', {user: user, article: article});;
		});
	});


//########################
// API
//########################
	


	/////////////////
	// User
	////////////////
	app.get('/api/user');

	app.post('/api/user/login', passport.authenticate('local-login'), function (req, res) {
	    // Generate a JSON response reflecting authentication status
	    if (!req.user) {
	      return res.send({ success : false, message : 'Try again.' });
	    }
	    
	    return res.send({ success : true, message : 'Logged in successfully !' });
	});

	app.post('/api/user', passport.authenticate('local-signup'), function (req, res) {
		// Generate a JSON response reflecting authentication status
		if (!req.user) {
		return res.send({ success : false, message : 'Try again.' });
		}
		
		return res.send({ success : true, message : 'User is now in the database.' });
	});

	app.put('/api/user', function (req, res) {
		const data = req.body;
		
		User.findById(req.user.id, function (err, user) {
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

	app.delete('/api/user');


	/////////////////
	// Article
	////////////////
	app.get('/api/article/s/:userId', function (req, res) {
		const user = req.params.userId;

		Article.find({authorID: user}, '-isDraft -markdown', function (err, docs) {
			if (err)
				return res.send({success : false, message : 'An error occured'});
			else
				return res.send(docs);
		});
	});

	app.get('/api/article');

	app.post('/api/article', function (req, res) {
		const data = req.body;
		const userId = req.user.id;

		let newArticle = new Article();

		newArticle.authorID = userId;
		newArticle.isDraft = false;
		newArticle.headline = data.headline;
		newArticle.datePublished = data.dateNow;
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

	app.post('/api/article/draft', function (req, res) {
		const data = req.body;
		const userId = req.user.id;

		let newArticleDraft = new Article();

		newArticleDraft.authorID = userId;
		newArticleDraft.isDraft = true;
		newArticleDraft.headline = data.headline;
		newArticleDraft.datePublished = '';
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

	app.put('/api/article/publish', function (req, res) {
		const data = req.body;
		const userId = req.user.id;
		const articleId = mongoose.Types.ObjectId(data.articleID);

		Article.findById(articleId, function (err, article) {
			
			article.authorID = userId;
			article.isDraft = false;
			article.headline = data.headline;
			if (article.datePublished == '') {
				article.datePublished = data.dateNow;
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

	app.put('/api/article/draft', function (req, res) {
		const data = req.body;
		const userId = req.user.id;
		const articleId = mongoose.Types.ObjectId(data.articleID);

		Article.findById(articleId, function (err, article) {
			
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

	app.put('/api/article/viewcount', function (req, res) {
		const article = req.params.articleId;

		Article.findById(article, function (err, article) {
			article.viewCount++;
			article.save();

			if (err)
				return res.send({success : false, message : 'An error occured.'});
			else
				return res.send({success : true, message : 'View saved.'});
		});
	});

	app.put('/api/article/like', function (req, res) {
		const article = req.body.articleID;
		const readerIP = req.body.readerIP;

		Article.findById(article, function (err, article) {
			article.likes.push(readerIP);
			article.save();

			if (err)
				return res.send({success : false, message : 'An error occured.'});
			else
				return res.send({success : true, message : 'Like saved.'});
		});
	});

	app.put('/api/article/comment', function (req, res) {
		const data = req.body;
		const articleId = mongoose.Types.ObjectId(data.articleId);

		Article.findById(articleId, function (err, article) {
			const newId = article.comments.length;
			const newComment = {
				commentId: newId,
				name: data.name,
				email: data.email,
				content: data.comment
			};

			article.comments.push(newComment);
			article.save();

			if (err)
				return res.send({success : false, message : 'An error occured.'});
			else
				return res.send({success : true, message : 'Like saved.'});
		});
	});

	app.delete('/api/article', function (req, res) {
		const data = req.body;
		const toDelete = [];

		data.forEach(id => {
			toDelete.push(mongoose.Types.ObjectId(id));
		});
		Article.find({'_id': { $in: toDelete}}, function (err, docs){
			if (err)
				return res.send({success : false, message : 'An error occured'});
			else
				docs.forEach(doc => {
					doc.remove();
				});
				return res.send({success : true, message : 'Deletion successful !'});
		});
	});


	/////////////////
	// Subscribers
	////////////////
	app.get('/api/subscribers');

	app.get('/api/subscribers/export', function (req, res) {
		const filename = "subscribers.csv";
		csv.separator = ';';
		Subscriber.find({relatedUserId: req.user.id}, { '_id': 0, 'email' :1, 'firstName': 1, 'lastName': 1, 'dateRegistred': 1}).lean().exec(function (err, docs){
			if (err)
				return res.send({success : false, message : 'An error occured'});
			else
				return res.csv(docs, true, {"Content-Disposition": 'attachment; filename='+filename});
		});
	});

	app.post('/api/subscribers', function (req, res) {
		const data = req.body;
		let newSub = new Subscriber;

		newSub.relatedUserId = data.userID;
		newSub.email = data.email;
		newSub.firstName = data.firstName;
		newSub.lastName = data.lastName;
		newSub.dateRegistred = data.dateRegistred;

		newSub.save(err => {
			if (err)
				return res.send({success : false, message : 'An error occured.'});
			else
				return res.send({success : true, message : 'Subscriber registred !'});

		});
	});
		
	app.delete('/api/subscribers', function (req, res) {
		const data = req.body;
		const toDelete = [];

		data.forEach(id => {
			toDelete.push(mongoose.Types.ObjectId(id));
		});
		Subscriber.find({'_id': { $in: toDelete}}, function (err, docs){
			if (err)
				return res.send({success : false, message : 'An error occured'});
			else
				docs.forEach(doc => {
					doc.remove();
				});
				return res.send({success : true, message : 'Deletion successful !'});
		});
	});
	

	/////////////////
	// Utilities
	////////////////
	app.post('/api/upload-image', upload.single('file'), function (req, res) {
		var file = req.file;
		var imgurUploadOptions = {
			"method": "POST",
		  	"url": "https://api.imgur.com/3/image",
		  	"formData": {"image": file.buffer.toString('base64')},
		  	"headers": {
		    	"authorization": "Client-ID "+ imgurID +""
		  	}
		};
		request(imgurUploadOptions, function (error, response, body) {
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