const express = require('express');
const bodyParser = require('body-parser');

// used to simplify file paths - core module
const path = require('path');

// Express Validator Middleware
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

// MongoJS
const mongojs = require('mongojs');
const db = mongojs('tmntapp', ['turtles']);

var ObjectId = mongojs.ObjectId;

const app = express();

// Using ejs for our templates, adding some middleware
// View Engine
app.set('view engine', 'ejs');

// Specify what folder we want to use for our templates
app.set('views', path.join(__dirname, 'views'));

// Global Variables
app.use(function(req, res, next) {
	
	// Define your global vars like below - 'res.local.{globalvariable}'
	res.locals.errors = null;
	next();
});


// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path - for static resourcess such as css files/jQuery/etc
app.use(express.static(path.join(__dirname, 'public')));


// var turtles = [
// 	{
// 		id: 1,
// 		name: 'Leonardo',
// 		email: 'leo@tmnt.com',
// 		favFood: 'Pizza'
// 	},
// 	{
// 		id: 2,
// 		name: 'Raphael',
// 		email: 'raph@tmnt.com',
// 		favFood: 'Burger'
// 	},
// 	{
// 		id: 3,
// 		name: 'Donatello',
// 		email: 'don@tmnt.com',
// 		favFood: 'Shawarma'
// 	},
// 	{
// 		id: 4,
// 		name: 'Michealangelo',
// 		email: 'angelo@tmnt.com',
// 		favFood: 'Pizza'
// 	}
// ]


// app.get('/', (req, res) => {
// 	//take the response and send
// 	res.json(turtle);
// });



// Render the view we want with the objects we want to display?
app.get('/', (req, res) => {
	db.turtles.find( (err, docs) => {
		console.log(docs);
		res.render('index', {
			title: 'Turtles',
			//turtles: turtles
			turtles: docs		// coming from the db
		});
	});

});

app.post('/turtles/add', [
	check('name').isLength({ min: 1 }).withMessage("Name is required!"),

	check('email').isLength({ min: 1 }).withMessage("Email is required!")
	.exists().withMessage('favFood is required!')
	.isEmail().withMessage('This field must be a valid email'),

	check('favFood').isLength({ min: 1}).withMessage('Fav Food is required!')
	], (req, res) => {

		// Get the validation result whenever you want; see the Validation Result API for all options!
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			//console.log(errors.mapped());
			//return res.status(422).json({ errors: errors.mapped() });

			res.render('index', {
				title: 'Turtles',
				turtles: turtles,
				errors: errors.array()
			});
		}
		else {

			//console.log('Form submitted!');
			var newTurtle = {
				name: req.body.name,
				email: req.body.email,
				favFood: req.body.favFood
			}

			//console.log('Created ' + req.body.name + ' successfully!');

			// Insert newTurtle as a record in our mongodb collection
			db.turtles.insert(newTurtle, (err, result) => {
				if (err) {
					console.log(err)
				}
				res.redirect('/');
			});
		}

	console.log(newTurtle);
});

app.delete('/turtles/delete/:id', (req, res) => {
	//console.log(req.params.id);

	db.turtles.remove({_id: ObjectId(req.params.id)}, (err) => {
		if(err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

// listen on port 3000
app.listen(3000, () => {
	console.log('Server started on port 3000...');
});




// ============================== Simple WebServer Example ============================
// core module so I didn't need to install it
// const http = require('http');
// const fs = require('fs');

// const hostname = '127.0.0.1';
// const port = 3000;

// fs.readFile('index.html', (err, html) => {
// 	if (err) {
// 		throw err;
// 	}

// 	const server = http.createServer((req, res) => {
// 		res.statusCode = 200;
// 		res.setHeader('Content-type', 'text/html');
// 		res.write(html);
// 		res.end();
// 	});

// 	server.listen(port, hostname, () => {
// 		console.log('Server started on port' + port);
// 	});

// });
