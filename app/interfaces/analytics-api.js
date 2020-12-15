const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function workerPerformance(filters) {
  const pool = await poolHubie;
  let result = null;
  result = await pool.request()
  .input('fk_radnik', sql.Int, filters.workerId)
  .input('Datum_Od', sql.NVarChar, filters.dateFrom)
  .input('Datum_Do', sql.NVarChar, filters.dateTo)
  .input('Fk_ST_90', sql.Int, +filters.workorderStatus)
  .input('fk_partner', sql.Int, filters.partnerId)
  .input('fk_artikalPredmetServisa', sql.Int, +filters.assetId)
  .input('fk_ArtikalUsluga', sql.Int, +filters.serviceId)
  .input('fk_st_22', sql.Int, 0)
  .execute('sp_ReportServisUcinakRadnika_eServis');
  return await result;
}

module.exports = {
  workerPerformance
}