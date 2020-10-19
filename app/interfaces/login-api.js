const { poolHubie } = require('../config/db');
const { sql } = require('../config/db');

async function login(user, pass) {
    console.log('		hubie-interface.js user is logging in :', user, pass)
    const pool = await poolHubie
    return await pool.request()
      .input('username', sql.NVarChar, user)
      .input('password', sql.NVarChar, pass)
      .execute('sp_LogIn_eServis')
  }
    
module.exports = { login }