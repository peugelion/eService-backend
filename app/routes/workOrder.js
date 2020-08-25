let express = require('express'),
    router = express.Router(),
    hubieApi = require('../models/hubie-interface'),
    moment = require('moment');

moment.locale('sr');

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
router.get('/workOrdersOverview', async (req, res) => {
	try {
		// const SifraPreduzeca = req.session.SifraPreduzeca,
		// 	Fk_Jezik = req.session.Fk_Jezik,
    // 	Fk_PoslovnaGodina = req.session.Fk_PoslovnaGodina,

    let filters = JSON.parse(req.query.filters);
    filters.dateFrom = filters.dateFrom ? parseSrbDateParam(filters.dateFrom) : null;
    filters.dateTo = filters.dateTo ? parseSrbDateParam(filters.dateTo) : null;

    result = await hubieApi.workOrdersList(filters);
    res.json(result);
	} catch (err) {
		console.log(`/workOrdersOverview err ${err}`)
		res.json(err)
	}
});

// return workorder
router.get('/workorder/:id', async (req, res) => {
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
router.get('/findWorkersByNameOrCode/:nameOrCode', async (req, res) => {
	try {
    const nameOrCode = req.params.nameOrCode;

    result = await hubieApi.findWorkersByNameOrCode(nameOrCode);
    res.json(result);
	} catch (err) {
		console.log(`/findWorkersByNameOrCode err ${err}`)
		res.json(err)
	}
});

module.exports = router;