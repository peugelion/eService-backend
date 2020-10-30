const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function getWOParts(workorderID) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('fk_dokument', sql.BigInt, workorderID)
    .execute('sp_PageDelovi_eServis');

  return await result;
}

async function saveWOPart(params) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, params.userId)
    .input('Fk_Dokument', sql.BigInt, params.fk_dokument)
    .input('fk_Usluga', sql.Int, params.selectedService)
    .input('fk_Radnik', sql.Int, params.selectedWorker)
    .input('Kolicina', sql.Float, params.quantity)
    .input('Komentar', sql.NVarChar, params.comment)
    .input('Datum_Pocetka', sql.NVarChar, params.startDate)
    .input('VremePocetka', sql.Int, params.startTime)
    .input('Datum_Zavrsetka', sql.NVarChar, params.endDate)
    .input('VremeZavrsetka', sql.Int, params.endTime)
    .input('UtrosenoSati', sql.Float, parseFloat(params.spentTime))
    .execute('sp_InsertRadniNalogUsluga_eServis');

  return await result;
}

async function deleteWOPart(partId, userId) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, userId)
    .input('fk_StavkaNaloga', sql.BigInt, partId)
    .execute('sp_DeleteRadniNalogUsluga_eServis');

  return await result;
}

module.exports = {
  getWOParts,
  saveWOPart,
  deleteWOPart
}