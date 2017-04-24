'use strict'

//express
var express = require('express');
var app = express();

//http
var http = require('http').createServer(app);

//port and server
var port = process.env.PORT || 8000; 

///listen on server 
var server = app.listen(port); 

//osc 
var osc = require('node-osc');


//define client name
var OSCclient = new osc.Client('172.30.40.137', 6000);
// var dog = 'H'; 
// //+++++++++++++++++++++++++++++++++++++++++
// OSCclient.send(dog, 200, function(){
// 	console.log("Sent to MAX");
// 	OSCclient.kill();
// });



///server is running!
console.log('Server is running on: ' + port);

/////SOCKETIO

var io = require('socket.io').listen(server);



////EJS Templating (writing plain html)

var ejs = require('ejs');

//setup ejs
app.engine('.html', ejs.__express);
app.set('view-engine', 'html'); 

///set up views folder
app.set('views', __dirname + '/views');

//setup the public client folder
app.use(express.static(__dirname + '/public'));

//router - req is request from user, res is response get html file
app.get('/', function(req,res){
	res.render('index.html'); 
});



//app.get('/*')  -- use this route to render a 404

//Socket ....Read about ASN
var res;
var b;
var x1;
var y1;
var z1;
var c; 


//Main socket connection
io.on('connection', function(socket){

	//From here on now, we just define communication stuff in the already open socket
	console.log('A new connection. We currently have ' + io.engine.clientsCount);
	


	socket.on('newmessage', function(bone){
		//console.log(bone); 
		//console.log("Sent to MaxMSP");
		//Not to log every fucking message, stay sane
		var time = 0;
		time++;

		res = bone.split(",");
		//b = res[0][0];
		c = res[0][5]

		//console.log(c);
		x1=parseFloat((res[0].split('['))[1]);
		y1=parseFloat(res[1]);
		z1=parseFloat((res[2].split(']'))[0]);
		//console.log("Sent to MaxMSP2");
		// if(time % 10 == 0){
		// 	console.log(v2);
		// }
		
		//console.log(v1);
		io.emit('motioncapturedata', bone);

			OSCclient.send("bone", c, x1, y1, z1, function(err){
				
			if(err){
				//console.log(err);
			} else {
				//console.log("Sent to MAX");
			}
			
			//client.kill();
			});

		
	}); 

	console.log('hi');
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

	socket.on('disconnect', function(){
		console.log('User Disconnected'); 
	});



});




