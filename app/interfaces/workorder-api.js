const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function workOrdersList(filters) {
  const pool = await poolHubie;
  let result = null;
  // if (Object.keys(filters).length === 0 && filters.constructor === Object) { // empty filters object
  //   result = await pool.request().execute('sp_PageServisRadniNalogPregled_eServis');
  // } else {
    result = await pool.request()
    .input('fk_radnik', sql.Int, filters.workerId)
    .input('Broj_dokumentaOd', sql.BigInt, +filters.docNumFrom)
    .input('Broj_dokumentaDo', sql.BigInt, +filters.docNumTo)
    .input('Datum_Od', sql.NVarChar, filters.dateFrom)
    .input('Datum_Do', sql.NVarChar, filters.dateTo)
    .input('TipDatuma', sql.TinyInt, +filters.dateType)
    .input('Fk_ST_90', sql.Int, +filters.workorderStatus)
    .execute('sp_PageServisRadniNalogPregled_eServis');
  // }
  return await result;
}

async function getWorkorder(workorderID) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('fk_dokument', sql.BigInt, workorderID)
    .execute('sp_PageServisRadniNalogPregled_eServis');

  return await result;
}

async function changeWOStatus(params) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('Kor_id', sql.Int, params.userId)
    .input('Fk_DokumentServis', sql.BigInt, params.workorderId)
    .input('ZeljeniStatus', sql.Int, params.status)
    .execute('sp_ServisPromenaStatusa_eServis');
    
  return await result;
}

async function saveWorkorder(params) {
  console.log('params in saveWorkorder => ', params);
  const pool = await poolHubie;
  let result = await pool.request()
    .input('Kor_id', sql.Int, params.korId)
    .input('Datum', sql.NVarChar, params.createdDate)
    .input('Fk_ST_90', sql.Int, params.woStatus)
    .input('fk_Partner', sql.Int, params.partner)
    .input('fk_Artikal', sql.Int, params.asset)
    .input('fk_TipKvara', sql.Int, params.malfunction)
    .input('fk_radnik', sql.Int, params.workerAssigned)
    .input('Komentar', sql.NVarChar, params.comment)
    .input('PredmetServisa_Adresa', sql.NVarChar, params.address)
    .input('KontaktOsoba', sql.NVarChar, params.contactPerson)
    .input('KontaktOsoba_Telefon', sql.NVarChar, params.contactPhone)
    .execute('sp_InsertServisniRadniNalog_eServis ');

  return await result;
}

async function getMalfunctionTypes() {
  const pool = await poolHubie;
  result = await pool.request()
    .execute('sp_VratiTipKvara_eServis');

  return await result;
}

module.exports = {
  workOrdersList,
  getWorkorder,
  changeWOStatus,
  saveWorkorder,
  getMalfunctionTypes
}