const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('dashboard', { title: 'Hey', message: 'Hello there!', link: 'Go to test', link2: 'test'})
});

app.get('/test', function (req, res) {
	res.render('dashboard', { title: 'Oh', message: 'This is the test page', link: 'Go to root', link2: '/' })
});

app.listen(3000, function() {
	console.log('App is up and running on 3000!');
})