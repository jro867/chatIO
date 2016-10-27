    /**
      COMMENT:
        We are using node to tranlate the msg from each user. Look into the server.js file

        So every time that user enters a msg we grab the msg and use /translate in our server to call 
        http://api.phteven.io/intakepoint/ and then parse the data and send it back to to the frontend
        to post the translated msg.

        The rest of the project use node as a server for sockets IO.
    **/  

var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

//READ COMMENTS ABOVE!!

server.listen(3000); 
console.log("server running");

app.use(express.static('public'));

app.get('/translate',function(req,res,next){

  console.log("called server's translate");
  translatedPHMessage(req.query.q, function(data){
  	res.status(200).json(data);
  });

});
//READ COMMENTS ABOVE!!


app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('connected: %s sockets', connections.length);

	//disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username),1);
		updateUsernames
		connections.splice(connections.indexOf(socket),1);
		console.log("disconnected: %s sockets connected", connections.length);
	});

	socket.on('send message', function(data){
		console.log(data);
			io.sockets.emit('new message',{msg:data, user: socket.username});
		
	});
  //READ COMMENTS ABOVE!!!

	//new user
	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});

//Function use to tranlate the msg posted through the URL
//READ COMMENTS ABOVE
function translatedPHMessage(sentence, callback){

  var intakepoint = "api.phteven.io";

  var http = require('http');
  var querystring = require('querystring');


  var data = querystring.stringify({
  	'text' : sentence
  });

  console.log("NA: ", data);

  var post_options = {
      hostname: intakepoint,
      // port: "8080",
      path: "/translate/",
      method: 'POST',
       headers: {
	    'Content-Type': 'application/x-www-form-urlencoded'
	   }
  };

  var req = http.request(post_options,function(response){ //information from the response
    var str = ''
    response.on('data', function (chunk){//reads in the response...should be nothing
        str += chunk;
    });
    console.log(response.statusCode)//prints the response statuscode...generally 204
    response.on('end', function (){
        console.log("END: ", JSON.parse(str));
        callback(JSON.parse(str));
    });
  });
  
  req.write(data);
  req.end();

}
