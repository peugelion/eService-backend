const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function findPartsByNameOrCode(searchParams) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('id', sql.Int, +searchParams.id)
    .input('SearchForLIKE', sql.NVarChar, searchParams.nameOrCode)
    .execute('sp_PageDelovi_eServis');
    
  return await result;
}

async function getWOParts(workorderID) {
  const pool = await poolHubie;
  result = await pool.request()
    .input('fk_dokument', sql.BigInt, workorderID)
    .execute('sp_PageRadniNalogDelovi_eServis');

  return await result;
}

async function saveWOPart(params) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, params.userId)
    .input('Fk_Dokument', sql.BigInt, params.fk_dokument)
    .input('fk_Artikal', sql.Int, params.selectedPart)
    .input('fk_Radnik', sql.Int, params.selectedWorker)
    .input('fk_OrgJed', sql.Int, params.selectedWarehouse)
    .input('Kolicina', sql.Float, params.quantity)
    .input('Komentar', sql.NVarChar, params.comment)
    .execute('sp_InsertRadniNalogArtikal_eServis');

  return await result;
}

async function deleteWOPart(partParams, userId) {
  const pool = await poolHubie;
  let result = await pool.request()
    .input('kor_id', sql.Int, userId)
    .input('fk_StavkaNaloga', sql.BigInt, partParams.fk_StavkaNaloga)
    .input('Fk_Dokument', sql.BigInt, partParams.Fk_Dokument)
    .input('fk_OrgJed', sql.Int, partParams.fk_OrgJed)
    .input('Fk_Radnik', sql.Int, partParams.Fk_Radnik)
    .input('Fk_Artikal', sql.Int, partParams.Fk_Artikal)
    .execute('sp_DeleteRadniNalogArtikal_eServis');

  return await result;
}

module.exports = {
  findPartsByNameOrCode,
  getWOParts,
  saveWOPart,
  deleteWOPart
}