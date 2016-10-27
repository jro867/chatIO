var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

server.listen(3000); 
console.log("server running");

app.use(express.static('public'));

app.get('/translate',function(req,res,next){

  translatedPHMessage(req.query.q, function(data){
  	res.status(200).json(data);
  });

});


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
		// translatedPHMessage(data,function(transPH){
			// io.sockets.emit('new message',{msg:transPH, user: socket.username});
			io.sockets.emit('new message',{msg:data, user: socket.username});
		// });
		
	});

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


function translatedPHMessage(sentence, callback){

  var intakepoint = "api.phteven.io";

  var http = require('http');
  var querystring = require('querystring');

  // var data = querystring.stringify({
  // 	'text' : 'Stephen is a silly sausage who drinks at starbucks'
  // });

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
        console.log("END: ",JSON.parse(str));
        callback(JSON.parse(str));
    });
  });
  
  req.write(data);
  req.end();

}