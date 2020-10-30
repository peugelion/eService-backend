let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    partApi = require('../interfaces/part-api');

const parseSrbDateParam = (date) => {
  if (date && date.includes(' ')) {
    return date.split(' ')[0].split('.').reverse().join('-'); // eg '29.05.2018' ili '29.05.2018 10:30:45'
  } else if (date && date.includes('T')) {
    return date.split('T')[0].split('.').reverse().join('-'); // eg '2018-05-28T00:00:00.000Z'
  } else {
    return date ? date : new Date().toISOString().split('T')[0]; // eg '2018-05-29', today if no input
  }
};

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
    if (params.startDate) params.startDate = parseSrbDateParam(params.startDate);
    if (params.endDate) params.endDate = parseSrbDateParam(params.endDate);

    let result = await partApi.saveWOPart(params);
    res.json(result);
  } catch (err) {
    console.log(`/saveWOPart err ${err}`)
    res.status(500).json(err);
  }
});

router.delete('/deleteWOPart/:partId', authMw.isLoggedIn, async (req, res) => {
  try {
    const partId = req.params.partId;

    result = await partApi.deleteWOPart(partId, req.session.fk_radnik);
    res.json(result);
  } catch (err) {
    console.log(`/deleteWOPart err ${err}`)
    res.status(500).json(err);
  }
});

module.exports = router;