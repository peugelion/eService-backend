let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    workerTeamApi = require('../interfaces/worker-team-api');

// search workers to assign
router.get('/findWorkersByNameOrCode', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await workerTeamApi.findWorkersByNameOrCode(searchParams);
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
    result = await workerTeamApi.assignWorker(bodyParams);
    res.json(result);
  } catch (err) {
    res.status(500).json(err.originalError.info);
  }
});

module.exports = router;