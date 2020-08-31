#!/usr/bin/env node
'use strict';

require('dotenv').config() // https://github.com/motdotla/dotenv

let express = require("express"),
router = express.Router(),
bodyParser = require('body-parser'),
path = require('path'),
fs = require('fs'),
flash = require('connect-flash'),
methodOverride = require('method-override'),
session = require('express-session'),
cookieParser = require('cookie-parser'),
app = express();
var staticRoot = __dirname + '/public';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// with this I'm serving the public directory
app.use(express.static(__dirname + '/public'));

// methodOverride provides the override for PUT and DELETE HTTP methods
app.use(methodOverride('_method'));

app.use(session({
  secret: "Once upon a time...!",
	resave: false,
	saveUninitialized: false,
	cookie: {
    path: '/',
		httpOnly: true,
		secure: false,
		// maxAge: 30 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000, // 5 days
	}
}));

app.use(cookieParser());
app.use(flash());

// use the REST routes
const workOrderRoutes = require('./app/routes/workOrder');
app.use('/api', workOrderRoutes);

// middleware to use on every request
/* https://stackoverflow.com/questions/49640365/mean-nodejs-server-for-angular-app-how-do-i-serve-angular-routes */
app.use(function (req, res, next) {
	//if the request is not html then move along
	var accept = req.accepts('html', 'json', 'xml');
	if (accept !== 'html') {
		return next();
	}
	// if the request has a '.' assume that it's for a file, move along
	var ext = path.extname(req.path);
	if (ext !== '') {
		return next();
	}
	if (fs.existsSync(staticRoot + '/index.html')) {
		fs.createReadStream(staticRoot + '/index.html').pipe(res);
	}
});

// with this I'm serving the public directory
// const maxAge = 99 * 24 * 3600 * 1000; // 7 days, 3600000msec == 1hour
// app.use(express.static(__dirname + "/public", {
// 	maxAge: maxAge
// }));

app.use(router);

// Start the web server
// if (production) {
// 	// handles your app
// 	require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(process.env.HTTPS_PORT || 443, () =>
// 		console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address())
// 	);
// 	const server = app.listen(process.env.HTTP_PORT || 3000, () => {
// 		const host = server.address().address
// 		const port = server.address().port
// 		console.log(`PPS supervisor server started! Listening at http://${host}:${port}`);
// 	});
// } else {
const server = app.listen(process.env.HTTP_PORT || 3000, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`PPS supervisor server started! Listening at http://${host}:${port}`);
});
// 	const serverHttps = app.listen(process.env.HTTPS_PORT || 443, () => {
// 		const host = serverHttps.address().address
// 		const port = serverHttps.address().port
// 		console.log(`PPS supervisor server started! Listening at http://${host}:${port}`);
// 	});
// }