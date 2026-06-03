const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: '1',
    port: 5433,
});
pool.connect()
  .then(() => {
      console.log("Kết nối PostgreSQL thành công");

      pool.query('SELECT current_database()', (err, res) => {
          console.log("DB hiện tại:", res.rows);
      });
  })
  .catch((err) => console.log(err));
module.exports = pool;