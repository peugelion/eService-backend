let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    workorderApi = require('../interfaces/workorder-api');

const parseSrbDateParam = (date) => {
	if (date && date.includes(' ')) {
		return date.split(' ')[0].split('.').reverse().join('-'); // eg '29.05.2018' ili '29.05.2018 10:30:45'
	} else if (date && date.includes('T')) {
		return date.split('T')[0].split('.').reverse().join('-'); // eg '2018-05-28T00:00:00.000Z'
	} else {
		return date ? date : new Date().toISOString().split('T')[0]; // eg '2018-05-29', today if no input
	}
};

// return work orders list
router.get('/workOrdersOverview', authMw.isLoggedIn, async (req, res) => {
	try {
    let filters = JSON.parse(req.query.filters);
    if (filters.dateFrom) filters.dateFrom = parseSrbDateParam(filters.dateFrom);
    if (filters.dateTo) filters.dateTo = parseSrbDateParam(filters.dateTo);

    result = await workorderApi.workOrdersList(filters);
    res.json(result);
	} catch (err) {
		console.log(`/workOrdersOverview err ${err}`)
		res.json(err)
	}
});

// return workorder
router.get('/workorder/:id', authMw.isLoggedIn, async (req, res) => {
	try {
		const workorderID = req.params.id;

    result = await workorderApi.getWorkorder(workorderID);
    res.json(result);
	} catch (err) {
		console.log(`/workorder/:id err ${err}`)
		res.json(err)
	}
});

// change workorder status
router.put('/changeWOStatus', authMw.isLoggedIn, async (req, res) => {
  try {
    const bodyParams = req.body;
    result = await workorderApi.changeWOStatus(bodyParams);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.originalError.info);
  }
});

module.exports = router;