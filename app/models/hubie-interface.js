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
    login: async (user, pass) => {
			console.log('		hubie-interface.js user is logging in :', user, pass)
			const pool = await poolHubie
			return await pool.request()
				.input('username', sql.NVarChar, user)
				.input('password', sql.NVarChar, pass)
				.execute('sp_LogIn_eServis')
		},
    workOrdersList: async (filters) => {
      const pool = await poolHubie;
      let result = null;
      if (Object.keys(filters).length === 0 && filters.constructor === Object) { // empty filters object
        result = await pool.request().execute('sp_PageServisRadniNalogPregled_eServis');
      } else {
        result = await pool.request()
        .input('fk_radnik', sql.Int, filters.workerId)
        .input('Broj_dokumentaOd', sql.BigInt, +filters.docNumFrom)
        .input('Broj_dokumentaDo', sql.BigInt, +filters.docNumTo)
        .input('Datum_Od', sql.NVarChar, filters.dateFrom)
        .input('Datum_Do', sql.NVarChar, filters.dateTo)
        .input('TipDatuma', sql.TinyInt, +filters.dateType)
        .input('Fk_ST_90', sql.Int, +filters.workorderStatus)
        .execute('sp_PageServisRadniNalogPregled_eServis');
      }
      return await result;
    },
    getWorkorder: async (workorderID) => {
      const pool = await poolHubie;
      result = await pool.request()
        .input('fk_dokument', sql.BigInt, workorderID)
        .execute('sp_PageServisRadniNalogPregled_eServis');

      return await result;
    },
    findWorkersByNameOrCode: async (searchParams) => {
      const pool = await poolHubie;
      result = await pool.request()
        .input('id', sql.Int, +searchParams.id)
        .input('SearchForLIKE', sql.NVarChar, searchParams.searchVal)
        .execute('sp_PageRadnik_eServis');
        
      return await result;
    },
    assignWorker: async (params) => {
      const pool = await poolHubie;
      result = await pool.request()
        .input('Kor_id', sql.Int, params.userId)
        .input('fk_dokument', sql.BigInt, params.workorderId)
        .input('fk_radnik', sql.Int, params.workerId)
        .execute('sp_UpdateRadnik_eServis');

      return await result;
    },
    changeWOStatus: async (params) => {
      const pool = await poolHubie;
      result = await pool.request()
        .input('Kor_id', sql.Int, params.userId)
        .input('Fk_DokumentServis', sql.BigInt, params.workorderId)
        .input('ZeljeniStatus', sql.Int, params.status)
        .execute('sp_ServisPromenaStatusa_eServis');
        
      return await result;
    }
	}
}();