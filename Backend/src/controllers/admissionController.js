const pool = require('../config/db');

const addAdmission = async (req, res) => {
    const {
        ho_ten, nam_sinh, gioi_tinh, so_dien_thoai, dia_chi, so_bhyt,
        khoa_id, bac_si_id, y_ta_id, chan_doan, ly_do, benh_su, nhom_mau, cap_do
    } = req.body;

    if (!ho_ten || !khoa_id || !bac_si_id) {
        return res.status(400).json({ success: false, message: "Thiếu tên bệnh nhân, khoa hoặc bác sĩ" });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Bắt đầu giao dịch

        // BƯỚC 1: Thêm mới bệnh nhân
        const insertPatientRes = await client.query(
            `INSERT INTO BenhNhan (ho_ten, nam_sinh, gioi_tinh, so_dien_thoai, dia_chi, so_bhyt) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [ho_ten, nam_sinh, gioi_tinh, so_dien_thoai, dia_chi, so_bhyt]
        );

        const newPatientId = insertPatientRes.rows[0].id;

        // BƯỚC 2: Thêm hồ sơ nhập viện bằng ID bệnh nhân vừa tạo
        const insertAdmissionRes = await client.query(
            `INSERT INTO HoSoNhapVien (benh_nhan_id, khoa_id, bac_si_id,y_ta_id, chan_doan_ban_dau, ly_do_nhap_vien, benh_su, trang_thai_ho_so,nhom_mau,cap_do) 
             VALUES ($1, $2, $3, $4, $5, $6,$7, 'Chờ xếp giường',$8,$9) RETURNING *`,
            [
                newPatientId,
                khoa_id,
                bac_si_id,
                y_ta_id,
                chan_doan,
                ly_do,
                benh_su,
                nhom_mau,
                cap_do
            ]
        );

        await client.query('COMMIT'); // Hoàn tất giao dịch

        res.json({
            success: true,
            message: 'Đã thêm bệnh nhân và tạo hồ sơ thành công',
            data: insertAdmissionRes.rows[0]
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("LỖI TRANSACTION:", err.message);
        res.status(500).json({ success: false, message: "Lỗi hệ thống: " + err.message });
    } finally {
        client.release();
    }
};
const getAdmissionHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT * FROM DienBienBenh WHERE ho_so_id = $1 ORDER BY ngay_ghi DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const addAdmissionHistory = async (req, res) => {
    const { ho_so_id, tieu_de, noi_dung, mach, huyet_ap, nhiet_do, nhip_tho } = req.body;
    try {
        await pool.query(
            `INSERT INTO DienBienBenh (ho_so_id, tieu_de, noi_dung, mach, huyet_ap, nhiet_do, nhip_tho) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [ho_so_id, tieu_de, noi_dung, mach, huyet_ap, nhiet_do, nhip_tho]
        );
        res.json({ success: true, message: "Đã ghi nhận diễn biến bệnh" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { addAdmission, getAdmissionHistory, addAdmissionHistory };