let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    analyticsApi = require('../interfaces/analytics-api');

const parseSrbDateParam = (date) => {
	if (date && date.includes(' ')) {
		return date.split(' ')[0].split('.').reverse().join('-'); // eg '29.05.2018' ili '29.05.2018 10:30:45'
	} else if (date && date.includes('T')) {
		return date.split('T')[0].split('.').reverse().join('-'); // eg '2018-05-28T00:00:00.000Z'
	} else {
		return date ? date : new Date().toISOString().split('T')[0]; // eg '2018-05-29', today if no input
	}
};

// get worker performance data
router.get('/getWorkerPerformanceData', authMw.isLoggedIn, async (req, res) => {
	try {
    let filters = JSON.parse(req.query.filters);
    if (filters.dateFrom) filters.dateFrom = parseSrbDateParam(filters.dateFrom);
    if (filters.dateTo) filters.dateTo = parseSrbDateParam(filters.dateTo);

    result = await analyticsApi.workerPerformance(filters);
    res.json(result);
	} catch (err) {
		console.log(`/getWorkerPerformanceData err ${err}`)
		res.json(err)
	}
});

module.exports = router;