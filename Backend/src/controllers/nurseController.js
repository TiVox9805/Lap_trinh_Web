const pool = require('../config/db');

const waitingList = async (req, res) => {
    try {
        const list = await pool.query(
            `SELECT h.id as hoso_id, b.ho_ten, b.nam_sinh, k.ten_khoa, h.chan_doan_ban_dau, u.fullname as bac_si_chi_dinh
             FROM hosonhapvien h
             JOIN BenhNhan b ON h.benh_nhan_id = b.id
             JOIN Khoa k ON h.khoa_id = k.id
             JOIN users u ON h.bac_si_id = u.id
             WHERE h.trang_thai_ho_so = 'Chờ xếp giường'`
        );
        res.json(list.rows);
    } catch (err) {
        res.status(500).json({ message: 'Không thể lấy danh sách chờ' });
    }
};
const assignBed = async (req, res) => {
    const { hoso_id, giuong_id, y_ta_id } = req.body;
    const client = await pool.connect();
    if (!hoso_id || !giuong_id || !y_ta_id) {
        return res.status(400).json({
            success: false,
            message: "Thiếu thông tin hoso_id, giuong_id hoặc y_ta_id"
        });
    }
    try {
        await client.query('BEGIN');


        await client.query(
            `UPDATE HoSoNhapVien 
             SET giuong_id = $1, trang_thai_ho_so = 'Đang điều trị' 
             WHERE id = $2`,
            [giuong_id, hoso_id]
        );

        // 2. Cập nhật giường: Đổi trạng thái sang 'Đang sử dụng'
        await client.query(
            `UPDATE Giuong SET trang_thai = 'Đang sử dụng' WHERE id = $1`,
            [giuong_id]
        );
        const logQuery = `
        INSERT INTO lich_su_giuong (
            giuong_id, 
            ho_so_benh_nhan_id, 
            nhan_vien_thuc_hien_id, 
            hanh_dong, 
            trang_thai_cu, 
            trang_thai_moi, 
            ghi_chu,
            thoi_gian
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`;
        await client.query(logQuery, [giuong_id, hoso_id, y_ta_id, 'Tiếp nhận bệnh nhân - Gán giường', 'Trống', 'Đang sử dụng', null]);
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
}
const getnurseInfo = async (req, res) => {
    const { khoa_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT u.id, u.fullname 
             FROM users u
             JOIN khoa k ON k.id = u.khoa_id
             WHERE u.role = 'Y tá' and u.khoa_id = $1
             ORDER BY u.fullname ASC`,
            [khoa_id]
        );
        res.json(result.rows);
        if (result.rows.length === 0) {
            return res.json([]);
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Lỗi khi lấy danh sách y tá" });
    }
};

const getOverviewStats = async (req, res) => {
    const { khoa_id } = req.query;
    try {
        const totalPatients = await pool.query("SELECT COUNT(*) FROM HoSoNhapVien WHERE trang_thai_ho_So!='Đã xuất viện' AND khoa_id = $1", [khoa_id]);
        const inTreatment = await pool.query("SELECT COUNT(*) FROM HoSoNhapVien WHERE trang_thai_ho_so = 'Đang điều trị' AND khoa_id = $1", [khoa_id]);
        const waiting = await pool.query("SELECT COUNT(*) FROM HoSoNhapVien WHERE trang_thai_ho_so = 'Chờ xếp giường' AND khoa_id = $1", [khoa_id]);

        const beds = await pool.query('SELECT COUNT(*) FROM Giuong g JOIN phong p ON g.phong_id = p.id WHERE p.khoa_id = $1 AND g.is_deleted=false', [khoa_id]);
        const occupiedBeds = await pool.query("SELECT COUNT(*) FROM Giuong g JOIN phong p ON g.phong_id = p.id  WHERE trang_thai = 'Đang sử dụng' AND p.khoa_id = $1", [khoa_id]);
        const cleanBeds = await pool.query("SELECT COUNT(*) FROM Giuong g JOIN phong p ON g.phong_id = p.id WHERE trang_thai = 'Đang dọn dẹp' AND p.khoa_id = $1", [khoa_id]);
        const deptStats = await pool.query(`
   SELECT k.ten_khoa, COUNT(hs.id) as so_luong
    FROM Khoa k
    LEFT JOIN HoSoNhapVien hs ON k.id = hs.khoa_id AND hs.trang_thai_ho_So!='Đã xuất viện'
    GROUP BY k.ten_khoa
`);

        const totalP = parseInt(totalPatients.rows[0].count) || 0;
        const treatmentP = parseInt(inTreatment.rows[0].count) || 0;
        const waitingP = parseInt(waiting.rows[0].count) || 0;

        const totalB = parseInt(beds.rows[0].count) || 0;
        const occupiedB = parseInt(occupiedBeds.rows[0].count) || 0;
        const cleanB = parseInt(cleanBeds.rows[0].count) || 0;
        const emptyB = totalB - occupiedB - cleanB;

        // 3. Trả về JSON đúng cấu trúc Frontend cần
        res.json({
            patients: {
                total: totalP,
                inTreatment: treatmentP,
                waiting: waitingP,
                ready: 0
            },
            beds: {
                total: totalB,
                occupied: occupiedB,
                clean: cleanB,
                empty: emptyB
            },
            departments: deptStats.rows.map(row => ({
                name: row.ten_khoa,
                count: parseInt(row.so_luong)
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const getPendingActions = async (req, res) => {
    const { nurse_id } = req.params;
    try {
        const pendingActions = await pool.query(
            `SELECT Count(*) as total_pending
             FROM hosonhapvien h
             JOIN users u ON h.y_ta_id = u.id
             WHERE h.trang_thai_ho_so IN ('Chờ xếp giường', 'Chờ xuất viện') AND h.y_ta_id = $1`,
            [nurse_id]
        );
        res.json(parseInt(pendingActions.rows[0].total_pending));
    } catch (error) {
        res.status(500).json({ error: "Lỗi lấy thông báo" });
    }
};
module.exports = { waitingList, assignBed, getnurseInfo, getOverviewStats, getPendingActions };