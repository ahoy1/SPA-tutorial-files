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


