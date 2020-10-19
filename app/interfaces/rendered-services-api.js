const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function getRenderedServices(workorderID) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('fk_dokument', sql.BigInt, workorderID)
    .execute('sp_PageRadniNalogUsluge_eServis');

  return await result;
}

async function allavailableRenderedServices(searchParams) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('id', sql.Int, +searchParams.id)
    .input('SearchForLIKE', sql.NVarChar, searchParams.searchVal)
    .execute('sp_VratiUsluge_eServis');
    
  return await result;
}

async function saveRenderedService(params) {
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

async function editRenderedService(params) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, params.userId)
    .input('fk_StavkaNaloga', sql.BigInt, params.renderedServiceId)
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
    .execute('sp_UpdateRadniNalogUsluga_eServis');

  return await result;
}

async function deleteRenderedService(serviceId, userId) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, userId)
    .input('fk_StavkaNaloga', sql.BigInt, serviceId)
    .execute('sp_DeleteRadniNalogUsluga_eServis');

  return await result;
}

module.exports = {
  getRenderedServices,
  allavailableRenderedServices,
  saveRenderedService,
  editRenderedService,
  deleteRenderedService
}