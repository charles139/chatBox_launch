// require express and path
var express = require("express");

var path = require("path");
// create the express app
var app = express();

// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket){
	console.log("socket are on...");
	console.log(socket.id);
	var message_array = [];
	var user = [];

	socket.on('new_user', function(data){
		user.push(data.name);
		io.emit('new_user_from_server', {response: user, message_load: message_array});
	});


	socket.on('new_message', function(data){
		message_array.push(data);
		console.log(message_array);
		io.emit('post_message', {response: message_array});
	});

	socket.on('disconnect', function(){
		console.log(user);
		io.emit('disconnect', {response: user + " has been disconnected"});
	});
});