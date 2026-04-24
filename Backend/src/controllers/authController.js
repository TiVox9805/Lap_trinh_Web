const pool = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Truy vấn kiểm tra tài khoản, mật khẩu và trạng thái hoạt động
        const userQuery = await pool.query(
            'SELECT id, fullname, role, khoa_id FROM users WHERE username = $1 AND password = $2 AND status = $3',
            [username, password, 'Hoạt động']
        );

        if (userQuery.rows.length > 0) {
            res.json({
                success: true,
                user: userQuery.rows[0]
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Tài khoản hoặc mật khẩu không chính xác'
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ hệ thống');
    }
};

module.exports = { login };