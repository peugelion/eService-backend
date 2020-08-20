let express = require('express'),
    router = express.Router(),
    hubieApi = require('../models/hubie-interface'),
    moment = require('moment');

moment.locale('sr');

// return work orders list
router.get('/workOrdersOverview', async (req, res) => {
	try {
		// const SifraPreduzeca = req.session.SifraPreduzeca,
		// 	Fk_Jezik = req.session.Fk_Jezik,
		// 	Fk_PoslovnaGodina = req.session.Fk_PoslovnaGodina,
		// 	parsedDate = moment(req.query.datum).format('YYYY-MM-DD')
		result = await hubieApi.workOrdersList();
		// res.json({
		// 	'workerRoutes': result.recordset.map(route => {
		// 		route.Naziv = route.Naziv.split(route.Mesto)[0].trim()
		// 		route.DatumPocetka = moment(route.DatumPocetka).utc().format('HH:mm')
		// 		route.DatumZavrsetka = moment(route.DatumZavrsetka).utc().format('HH:mm')
		// 		route.DuzinaPosete = moment(route.DuzinaPosete).utc().format('mm:ss')
		// 		if (route.PauzaMinuta === '00:00') {
		// 			// route.PauzaMinuta = ''
		// 			delete route.PauzaMinuta
		// 		}
		// 		return route
    //   })
    // });
    res.json(result);
	} catch (err) {
		console.log(`/workOrdersOverview err ${err}`)
		res.json(err)
	}
});

module.exports = router;