const fs = require('fs');
const path = require('path');
const db = require('./db');

async function init() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '001_initial.sql'),
      'utf8'
    );
    await db.query(sql);
    console.log('Database schema synced successfully');
  } catch (err) {
    console.error('Failed to sync database schema:', err.message);
    throw err;
  }
}

module.exports = { init };
