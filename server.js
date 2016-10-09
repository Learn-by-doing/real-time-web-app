var express = require('express');
var serveStatic = require('serve-static');
var Primus = require('primus');
var app = express();

app.server = app.listen(3000, 'localhost', function() {
	console.log('Web server listening on localhost:3000');
});

var primus = new Primus(app.server, {/* options */});

app.use(serveStatic(__dirname + '/public'));

primus.save(__dirname +'/public/js/primus.js');

primus.on('connection', function(spark) {
	console.log('Client connected!');
	spark.write('Hi there!');
	spark.on('data', function(data) {
		// Broadcast to other clients.
		console.log('Received data:', data);
		primus.forEach(function(spark) {
			spark.write(data);
		});
	});
});
