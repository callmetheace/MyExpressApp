var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

//Middleware

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

/* example

var logger = function (req, res, next) {
	console.log('logging...');
	next();
}

app.use(logger);
*/

//Route
app.get('/', function(req, res){
	db.users.find(function (err, docs) {
    // docs is an array of all the documents in mycollection 
    console.log(docs);
    	res.render('index', {
		title:'Customers',
		users: docs
		});
})
	
	// res.json(people);
	// res.send("Hello World");
});

app.post('/users/add', function(req, res){

	req.checkBody('name', 'Name is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
		title:'Customers',
		users: users,
		errors: errors
	});
}else{
		var newUser ={
		name: req.body.name
	}

	db.users.insert(newUser, function(err,result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
	}
});

app.delete('/users/delete/:id', function(req,res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, resulst){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	})
});

app.listen(3000, function(){
	console.log('server started on port 3000');
});