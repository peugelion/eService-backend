let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    renderedServiceApi = require('../interfaces/rendered-services-api');

const parseSrbDateParam = (date) => {
  if (date && date.includes(' ')) {
    return date.split(' ')[0].split('.').reverse().join('-'); // eg '29.05.2018' ili '29.05.2018 10:30:45'
  } else if (date && date.includes('T')) {
    return date.split('T')[0].split('.').reverse().join('-'); // eg '2018-05-28T00:00:00.000Z'
  } else {
    return date ? date : new Date().toISOString().split('T')[0]; // eg '2018-05-29', today if no input
  }
};

// return all available services
router.get('/allRenderedServices', authMw.isLoggedIn, async (req, res) => {
  try {
    const searchParams = req.query;

    result = await renderedServiceApi.allavailableRenderedServices(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/allAvailableSrv err ${err}`)
		res.json(err)
	}
});

// return rendered services for a workorder
router.get('/renderedServices/:workorderID', authMw.isLoggedIn, async (req, res) => {
	try {
    result = await renderedServiceApi.getRenderedServices(req.params.workorderID);
    res.json(result);
	} catch (err) {
		console.log(`/renderedServices/:id err ${err}`)
		res.json(err)
	}
});

router.post('/saveEditRenderedService', authMw.isLoggedIn, async (req, res) => {
  try {
    const params = req.body;
    if (params.startDate) params.startDate = parseSrbDateParam(params.startDate);
    if (params.endDate) params.endDate = parseSrbDateParam(params.endDate);

    let result = null;
    if (params.renderedServiceId !== null) result = await renderedServiceApi.editRenderedService(params);
    else result = await renderedServiceApi.saveRenderedService(params);
    res.json(result);
  } catch (err) {
    console.log(`/saveRenderedService err ${err}`)
    res.status(500).json(err);
  }
});

router.delete('/deleteRenderedService/:serviceId', authMw.isLoggedIn, async (req, res) => {
  try {
    const serviceID = req.params.serviceId;

    result = await renderedServiceApi.deleteRenderedService(serviceID, req.session.fk_radnik);
    res.json(result);
  } catch (err) {
    console.log(`/deleteRenderedService err ${err}`)
    res.status(500).json(err);
  }
});

module.exports = router;