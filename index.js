const express = require('express');
const app = express();

/* Middlewares */
app.set('view engine', 'ejs');
app.use(express.static('public'));



/* Routes */
app.get('/', function (req, res) {
	res.render('dashboard', { title: 'Hey', message: 'Hello there!', link: 'Go to test', link2: 'test'});
});

app.get('/write-post', function (req, res) {
	res.render('editor');
});



/* 3, 2, 1, Launch ! */
app.listen(3000, function() {
	console.log('App is up and running on 3000!');
})