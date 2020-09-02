let express = require('express'),
	router = express.Router(),
	middleware = require('../middleware');

// handle login
router.post('/api/login', function (req, res) {
	middleware.handleLogin(req, res);
});

// logout
router.get("/api/logout", function (req, res) {
	req.session.destroy(err => {
		if (err) console.log("You are not logged out. Reason : " + err);
	});
	res.send();
});

module.exports = router;