let express = require('express'),
    router = express.Router(),
    authMw = require('../middleware'),
    warehouseApi = require('../interfaces/warehouse-api');

// search warehouses
router.get('/findWarehousesByNameOrCode', authMw.isLoggedIn, async (req, res) => {
	try {
    const searchParams = req.query;

    result = await warehouseApi.findWarehousesByNameOrCode(searchParams);
    res.json(result);
	} catch (err) {
		console.log(`/findWarehousesByNameOrCode err ${err}`)
		res.json(err)
  }
});

module.exports = router;