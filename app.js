#!/usr/bin/env node
'use strict';

require('dotenv').config() // https://github.com/motdotla/dotenv

let express = require("express"),
router = express.Router(),
bodyParser = require('body-parser'),
path = require('path'),
fs = require('fs'),
methodOverride = require('method-override'),
session = require('express-session'),
compression = require('compression'),
app = express();
var staticRoot = __dirname + '/public';

app.use(compression());
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
		maxAge: 24 * 60 * 60 * 1000, // 1 day
	}
}));

// use the REST routes
const workorderRoutes = require('./app/routes/workorder');
const renderedSrvRoutes = require('./app/routes/rendered-services');
const workerTeamsRoutes = require('./app/routes/worker-team');
const assetRoutes = require('./app/routes/asset');
const partnerRoutes = require('./app/routes/partner');
const partRoutes = require('./app/routes/part');
const warehouseRoutes = require('./app/routes/warehouse');
const analyticsRoutes = require('./app/routes/analytics');
app.use('/api', workorderRoutes);
app.use('/api', renderedSrvRoutes);
app.use('/api', workerTeamsRoutes);
app.use('/api', assetRoutes);
app.use('/api', partnerRoutes);
app.use('/api', partRoutes);
app.use('/api', warehouseRoutes);
app.use('/api', analyticsRoutes);
const loginLogoutRoutes = require('./app/routes/index');
app.use(loginLogoutRoutes);

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
  console.log(`eService server started! Listening at http://${host}:${port}`);
});
// 	const serverHttps = app.listen(process.env.HTTPS_PORT || 443, () => {
// 		const host = serverHttps.address().address
// 		const port = serverHttps.address().port
// 		console.log(`PPS supervisor server started! Listening at http://${host}:${port}`);
// 	});
// }