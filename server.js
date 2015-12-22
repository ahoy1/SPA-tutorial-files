var path = require('path');
var slug = require('slug');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('bodyParser');
var methodOverride = require('method-override');
var PouchDB = require('pouchdb');

//create the express server
var app = express();

//configure the client/public/ folder to be served at the root url
app.use(express.static(path.join(__dirname, 'client', 'public')));

//config express to behave as a REST API that only deals w/ JSON
app.use(methodOverride());
app.use(bodyParser());

//configure logger to write to console when a request is handled by server
//this is a dev-only setting
app.use(morgan('dev'));

//express controllers are functions that take a request object + a response obj
//
//controller for GET requests
var controllers = {
	base: {
		//sends a welcome message in JSON format
		//remember, we only want to return JSON 
		index: function(req, res) {
			res.send({welcome: 'My Bookmarks API v1.0'});
		}
	}
}
app.get('/api', controllers.base.index);

//server requires some parameters, a port on which the server will listen
//and a host IP

var port = process.env.PORT || 9125;
var host = process.env.HOST || '0.0.0.0';
var server = app.listen(port, host, function () {
  console.log('Example app listening at http://%s:%s', host, port)
});

