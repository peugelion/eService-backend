#!/usr/bin/env node
'use strict';

require('dotenv').config() // https://github.com/motdotla/dotenv

let express = require("express"),
router = express.Router(),
bodyParser = require('body-parser'),
flash = require('connect-flash'),
methodOverride = require('method-override'),
session = require('express-session'),
cookieParser = require('cookie-parser'),
cors = require('cors'),
app = express();

// body-parser provides req.body object
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// with this I'm serving the public directory
app.use(express.static(__dirname + "/public"));

// methodOverride provides the override for PUT and DELETE HTTP methods
app.use(methodOverride("_method"));

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

const corsWhitelist = ['http://localhost', 'http://localhost:4200', 'http://localhost:3000',
  'http://127.0.0.1', 'http://127.0.0.1:3000',  'http://127.0.0.1:4200',
  'http://10.11.2.219:4200', 'http://10.11.2.219', 'https://10.11.2.219:443', 'http://10.11.2.219:3000']
const corsOptions = {
	origin: function (origin, callback) {
	  if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
		  callback(null, true)
	  } else {
		  callback(new Error('Not allowed by CORS'), false)
	  }
	}
}
app.use(cors(corsOptions));



// use the REST routes
const workOrderRoutes = require('./app/routes/workOrder');
app.use(workOrderRoutes);
// app.use("/api/dashboard", dashboard); /* da se ng ruta i proxy api putanja razlikuju, sve api pozive sam prebacio na /api/ */

// root route
router.get("/", function(req, res) {
	res.redirect('workOrdersOverview');
});

// show landing page
// router.get('/workOrdersOverview', function(req, res) {
// 	let session = req.session;
// 	// hubieApi.loadTasks(session.companyCode, session.fk_appUser, session.lang_id)
// 	// 	.then(result => {
// 	// 		res.render('taskOverview', {moment: moment, loadedTasks: result.recordset});
// 	// 	})
// 	// 	.catch(err => {
// 	// 		console.log(err);
//   //   });
//   // res.render('workOrdersOverview');
//   res.send({"what": "sta", "where": "gde"});
// });


// middleware to use on every request
/* https://stackoverflow.com/questions/49640365/mean-nodejs-server-for-angular-app-how-do-i-serve-angular-routes */
// app.use(function (req, res, next) {
// 	res.locals.currentUser = req.session.currentUser;
// 	res.locals.error = req.flash("error");
// 	res.locals.success = req.flash("success");
// 	//if the request is not html then move along
// 	var accept = req.accepts('html', 'json', 'xml');
// 	if (accept !== 'html') {
// 		return next();
// 	}
// 	// if the request has a '.' assume that it's for a file, move along
// 	var ext = path.extname(req.path);
// 	if (ext !== '') {
// 		return next();
// 	}
// 	if (fs.existsSync(staticRoot + '/index.html')) {
// 		fs.createReadStream(staticRoot + '/index.html').pipe(res);
// 	}
// });

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