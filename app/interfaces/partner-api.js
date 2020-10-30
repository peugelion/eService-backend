const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function findPartnersByNameOrCode(searchParams) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('id', sql.Int, +searchParams.id)
    .input('SearchForLIKE', sql.NVarChar, searchParams.nameOrCode)
    .execute('sp_PagePartneri_eServis');
    
  return await result;
}

// async function assignWorker(params) {
//   const pool = await poolHubie;
//   result = await pool.request()
//     .input('Kor_id', sql.Int, params.userId)
//     .input('fk_dokument', sql.BigInt, params.workorderId)
//     .input('fk_radnik', sql.Int, params.workerId)
//     .execute('sp_UpdateRadnik_eServis');

//   return await result;
// }

module.exports = {
  findPartnersByNameOrCode
  // assignWorker
}