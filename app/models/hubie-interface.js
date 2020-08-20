const sql = require('mssql')

const configHubie = {
	'user': process.env.DB_USER || 'bla',
	'password': process.env.DB_PASS || 'password',
	'server': process.env.DB_HOST || '127.0.0.1',
	'database': 'Hubie',
	'connectionTimeout': 45000,
	'requestTimeout': 100000,
	'pool': {
		max: 15,
		idleTimeoutMillis: 60000
	},
	'options': {
		appName: 'eService-nodejs-app',
    instanceName: process.env.DB_INSTANCE || '',
    encrypt: false
	}
}

/* https://stackoverflow.com/questions/30356148/how-can-i-use-a-single-mssql-connection-pool-across-several-routes-in-an-express */
/* https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016 */
const poolHubie = new sql.ConnectionPool(configHubie).connect()
	.then(pool => { console.log('Connected to MSSQL poolHubie'); return pool; })
	.catch(err => console.log('Database Connection Failed! (poolHubie) Bad Config: ', err))

module.exports = function () {
  return {
    workOrdersList: async () => {
      const pool = await poolHubie
      return await pool.request().execute('sp_PageServisRadniNalogPregled_eServis');
    }
    // workOrdersList: async (companyCode, fiscalYear, lang_id, fk_seller, date) => {
    //   const pool = await poolHubie
    //   return await pool.request()
    //     .input('SifraPreduzeca', sql.Int, companyCode)
    //     .input('fk_poslovna_Godina', sql.Int, fiscalYear)
    //     .input('Jezik_id', sql.Int, lang_id)
    //     .input('Fk_Prodavac', sql.Int, fk_seller)
    //     .input('datum', sql.NVarChar, date)
    //     .execute('sp_RptDnevniPregledRute');
    // }
		// login: async (user, pass) => {
		// 	console.log('		hubie-interface.js user is logging in :', user, pass)
		// 	const pool = await poolHubie_web
		// 	return await pool.request()
		// 		.input('Username', sql.NVarChar, user)
		// 		.input('Password', sql.NVarChar, pass)
		// 		.execute('sv_LogIn')
		// },

		// vratiRS: function(companyCode, lang_id, appUser, whichTable, FkStSt) {
		// 	return poolHubie.request()
		// 						 .input('Sifra_Preduzeca', sql.Int, companyCode)
		// 						 .input('jezik_id', sql.Int, lang_id)
		// 						 .input('sifra_nvar', sql.NVarChar(16), appUser)
		// 						 .input('KojaTabela', sql.NVarChar(64), whichTable)
		// 						 .input('FkStSt', sql.Int, FkStSt)
		// 				.execute('sp_VratiRS');
		// },

		// vratiPodredjeneRadnike: function(companyCode, lang_id, fk_appUser) {
		// 	return poolHubie.request()
		// 						 .input('Sifra_Preduzeca', sql.Int, companyCode)
		// 						 .input('Jezik_Id', sql.Int, lang_id)
		// 						 .input('Sifra_Radnika', sql.Int, fk_appUser)
		// 				.execute('sp_VratiPodredjeneRadnike');
		// },
		// ova procedura vraca konkretne podatke o ruti za izabranog radnika - prodavca, podatke o njegovim posetama u danu
	}
}();