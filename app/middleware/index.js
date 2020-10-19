let { login } = require('../interfaces/login-api'),
	  middlewareObj = {};

middlewareObj.isLoggedIn = async (req, res, next) => {
	if (req.sessionID && req.session.fk_radnik) {
		return next();
	}

	// console.log('	isLoggedIn, no session, try to login with credentials from cookie ->');
	// let userData = await middlewareObj.authenticate(req, res);
	// if (userData) {
	// 	return next();
	// }

	console.log('  isLoggedIn false, no session ... send 401 ... . ');
	res.sendStatus(401); // Unauthorized
}

middlewareObj.handleLogin = async (req, res) => {
	try {
    let userData = await middlewareObj.authenticate(req, res);
		res.json(await userData);
	} catch (err) {
		console.log('err in middlewareObj.handleLogin', err);
		if (err.message === 'IncorrectLoginData') {
			res.sendStatus(401);
		} else {
			res.status(400).send(err.message)
    }
	};
}

/* authenticate and start session */
middlewareObj.authenticate = async (req, res) => {
  let username = req.body.username || ''; // req.cookies.hubieLoginUsername;
  let password = req.body.password || ''; // req.cookies.hubieLoginPassword;

  result = await login(username, password);
  req.session.username = username;
  req.session.fk_radnik = result.recordset[0].fk_radnik;
  req.session.sifra = result.recordset[0].sifra;
  req.session.nivo_pristupa = result.recordset[0].NivoPristupa;
  
  return result.recordset[0];
}

module.exports = middlewareObj;