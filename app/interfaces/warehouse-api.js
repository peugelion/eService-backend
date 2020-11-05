const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function findWarehousesByNameOrCode(searchParams) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('id', sql.Int, +searchParams.id)
    .input('SearchForLIKE', sql.NVarChar, searchParams.nameOrCode)
    .execute('sp_PageOrgJedinice_eServis');
    
  return await result;
}

module.exports = {
  findWarehousesByNameOrCode
}