const sql = require('mssql');

const config = {
	'user': process.env.DB_USER || 'bla',
	'password': process.env.DB_PASS || 'password',
	'server': process.env.DB_HOST || '127.0.0.1',
	'database': 'Hubie_web',
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
const poolHubie = new sql.ConnectionPool(config).connect()
	.then(pool => { 
    console.log('Connected to MSSQL poolHubie');
    return pool; })
	.catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolHubie
};