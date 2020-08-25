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
    workOrdersList: async (filters) => {
      const pool = await poolHubie;
      let result = null;
      if (Object.keys(filters).length === 0 && filters.constructor === Object) { // empty filters object
        result = await pool.request().execute('sp_PageServisRadniNalogPregled_eServis');
      } else {
        result = await pool.request()
        // .input('fk_dokument', sql.BigInt, 0)
        .input('Broj_dokumentaOd', sql.BigInt, +filters.docNumFrom)
        .input('Broj_dokumentaDo', sql.BigInt, +filters.docNumTo)
        .input('Datum_Od', sql.NVarChar, filters.dateFrom)
        .input('Datum_Do', sql.NVarChar, filters.dateTo)
        .input('TipDatuma', sql.TinyInt, +filters.dateType)
        // .input('fk_artikal', sql.Int, 0)
        // .input('Fk_partner', sql.Int, 0)
        .input('Fk_ST_90', sql.Int, +filters.workorderStatus)
        // .input('SN_Global', sql.NVarChar, '')
        // .input('fk_st_22', sql.Int, 0)
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
    findWorkersByNameOrCode: async (nameOrCode) => {
      const pool = await poolHubie;
      result = await pool.request()
        .input('SearchForLIKE', sql.NVarChar, nameOrCode)
        .execute('sp_PageRadnik_eServis');
        
      return await result;
    }
	}
}();