const pool = require('../config/db');
const getAllDepartments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM khoa');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { getAllDepartments };