let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    assetApi = require('../interfaces/asset-api');

// search assets
router.get('/getAssets', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await assetApi.findAssetsByNameOrCode(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/findAssetsByNameOrCode err ${err}`)
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