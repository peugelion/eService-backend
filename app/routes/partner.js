let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    partnerApi = require('../interfaces/partner-api');

// search assets
router.get('/findPartnersByNameOrCode', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await partnerApi.findPartnersByNameOrCode(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/findPartnersByNameOrCode err ${err}`)
		res.json(err)
  }
});

// assign worker to workorder
// router.put('/assignWorker', authMw.isLoggedIn, async (req, res) => {
//   try {
//     const bodyParams = req.body;
//     result = await assetApi.assignWorker(bodyParams);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json(err.originalError.info);
//   }
// });

module.exports = router;