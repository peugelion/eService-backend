let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    partApi = require('../interfaces/part-api');

// search warehouses
router.get('/findPartsByNameOrCode', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await partApi.findPartsByNameOrCode(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/findPartsByNameOrCode err ${err}`)
		res.json(err)
  }
});

// return added parts for a workorder
router.get('/woparts/:workorderID', authMw.isLoggedIn, async (req, res) => {
	try {
    result = await partApi.getWOParts(req.params.workorderID);
    res.json(result);
	} catch (err) {
		console.log(`/woparts/:id err ${err}`)
		res.json(err)
	}
});

router.post('/saveWOPart', authMw.isLoggedIn, async (req, res) => {
  try {
    const params = req.body;

    let result = await partApi.saveWOPart(params);
    res.json(result);
  } catch (err) {
    console.log(`/saveWOPart err ${err}`)
    res.status(500).json(err);
  }
});

router.delete('/deleteWOPart', authMw.isLoggedIn, async (req, res) => {
  try {
    const partParams = req.query;

    result = await partApi.deleteWOPart(partParams, req.session.kor_id);
    res.json(result);
  } catch (err) {
    console.log(`/deleteWOPart err ${err}`)
    res.status(500).json(err);
  }
});

module.exports = router;