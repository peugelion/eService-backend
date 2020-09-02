let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    hubieApi = require('../models/hubie-interface')

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
  console.log('req.sessionID = ', req.sessionID);
  console.log('req.session.fk_radnik = ', req.session.fk_radnik);
	try {
		// const SifraPreduzeca = req.session.SifraPreduzeca,
		// 	Fk_Jezik = req.session.Fk_Jezik,
    // 	Fk_PoslovnaGodina = req.session.Fk_PoslovnaGodina,

    let filters = JSON.parse(req.query.filters);
    if (filters.dateFrom) filters.dateFrom = parseSrbDateParam(filters.dateFrom);
    if (filters.dateTo) filters.dateTo = parseSrbDateParam(filters.dateTo);

    result = await hubieApi.workOrdersList(filters);
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

    result = await hubieApi.getWorkorder(workorderID);
    res.json(result);
	} catch (err) {
		console.log(`/workorder/:id err ${err}`)
		res.json(err)
	}
});

// search workers to assign
router.get('/findWorkersByNameOrCode', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await hubieApi.findWorkersByNameOrCode(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/findWorkersByNameOrCode err ${err}`)
		res.json(err)
  }
});

// assign worker to workorder
router.put('/assignWorker', authMw.isLoggedIn, async (req, res) => {
  try {
    const bodyParams = req.body;
    result = await hubieApi.assignWorker(bodyParams);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.originalError.info);
  }
});

// change workorder status
router.put('/changeWOStatus', authMw.isLoggedIn, async (req, res) => {
  try {
    const bodyParams = req.body;
    result = await hubieApi.changeWOStatus(bodyParams);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.originalError.info);
  }
});

module.exports = router;