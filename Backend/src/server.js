const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.get('/api/users', async (req, res) => {
    try {
        // Truy vấn lấy dữ liệu theo các cột trong giao diện của bạn
        const allUsers = await pool.query(
            'SELECT id,fullname, username, password, role, khoa_id, status, email_personal, phone FROM users ORDER BY id DESC'
        );
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ khi lấy danh sách người dùng');
    }
});
// API thêm tài khoản mới
app.post('/api/users/add', async (req, res) => {
    const { fullname, username, password, role, khoa_id, status, email_personal, phone } = req.body;

    try {
        const newUser = await pool.query(
            `INSERT INTO users (fullname, username, password, role, khoa_id, status, email_personal, phone) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [fullname, username, password, role, khoa_id, status, email_personal, phone]
        );

        res.json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        // Trả về lỗi nếu username đã tồn tại (vì ta đặt UNIQUE trong DB)
        res.status(500).json({ success: false, message: 'Lỗi: Tài khoản đã tồn tại hoặc thiếu dữ liệu!' });
    }
});
app.post('/api/admission/add', async (req, res) => {
    console.log("Dữ liệu nhận được:", req.body);
    const {
        ho_ten, nam_sinh, gioi_tinh, so_dien_thoai, dia_chi, so_bhyt, // Thông tin bệnh nhân
        khoa_id, bac_si_id, chan_doan, ly_do, benh_su             // Thông tin hồ sơ
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!ho_ten || !khoa_id || !bac_si_id) {
        return res.status(400).json({ success: false, message: "Thiếu tên bệnh nhân, khoa hoặc bác sĩ" });
    }

    const client = await pool.connect(); // Sử dụng client để thực hiện Transaction

    try {
        await client.query('BEGIN'); // Bắt đầu giao dịch

        // BƯỚC 1: Thêm mới bệnh nhân
        const insertPatientRes = await client.query(
            `INSERT INTO BenhNhan (ho_ten, nam_sinh, gioi_tinh, so_dien_thoai, dia_chi, so_bhyt) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [ho_ten, parseInt(nam_sinh), gioi_tinh, so_dien_thoai, dia_chi, so_bhyt]
        );

        const newPatientId = insertPatientRes.rows[0].id;

        // BƯỚC 2: Thêm hồ sơ nhập viện bằng ID bệnh nhân vừa tạo
        const insertAdmissionRes = await client.query(
            `INSERT INTO HoSoNhapVien (benh_nhan_id, khoa_id, bac_si_id, chan_doan_ban_dau, ly_do_nhap_vien, benh_su, trang_thai_ho_so) 
             VALUES ($1, $2, $3, $4, $5, $6, 'Chờ xếp giường') RETURNING *`,
            [
                newPatientId,
                parseInt(khoa_id),
                parseInt(bac_si_id),
                chan_doan || '',
                ly_do || '',
                benh_su || ''
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
        client.release(); // Giải phóng kết nối
    }
});
app.get('/api/nurse/waiting-list', async (req, res) => {
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
});
app.put('/api/nurse/assign-bed', async (req, res) => {
    const { hoso_id, giuong_id } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Sử dụng Transaction để đảm bảo an toàn dữ liệu

        // 1. Cập nhật hồ sơ: Gán giường và đổi trạng thái
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

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
});


// GET /api/beds
app.get('/api/beds', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                g.id, 
                g.ma_giuong, 
                g.trang_thai, 
                p.ten_phong, 
                k.ten_khoa
            FROM giuong g
            JOIN phong p ON g.phong_id = p.id
            JOIN khoa k ON p.khoa_id = k.id
            ORDER BY k.ten_khoa, p.ten_phong, g.ma_giuong
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/departments
app.get('/api/departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM khoa');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET /api/doctors
app.get('/api/users/doctors', async (req, res) => {
    const result = await pool.query('SELECT id, fullname FROM users WHERE role = "doctor"');
    res.json(result.rows);
});

app.get('/api/patient-records', async (req, res) => {
    try {
        const query = `
            SELECT h.id, b.ho_ten, b.nam_sinh, b.gioi_tinh, k.ten_khoa, 
                   g.ma_giuong, p.ten_phong, u.fullname as bac_si, 
                   h.chan_doan_ban_dau, h.thoi_gian_nhap_vien, h.trang_thai_ho_so,
                   (CURRENT_DATE::date - h.thoi_gian_nhap_vien::date) as so_ngay
            FROM HoSoNhapVien h
            JOIN BenhNhan b ON h.benh_nhan_id = b.id
            JOIN Khoa k ON h.khoa_id = k.id
            JOIN users u ON h.bac_si_id = u.id
            LEFT JOIN Giuong g ON h.giuong_id = g.id
            LEFT JOIN Phong p ON g.phong_id = p.id
            WHERE h.trang_thai_ho_so IN ('Chờ xếp giường', 'Đang điều trị')
            ORDER BY h.id DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ khi lấy hồ sơ nội trú');
    }
});


app.get('/api/patients/inpatient', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                bn.id, 
                bn.ho_ten, 
                bn.nam_sinh, 
                bn.gioi_tinh, 
                bn.so_dien_thoai, 
                bn.dia_chi, 
                bn.so_bhyt,
                hs.id as id_ho_so,
                hs.chan_doan_ban_dau, 
                hs.ly_do_nhap_vien, 
                hs.benh_su,
                hs.thoi_gian_nhap_vien,
                k.ten_khoa,
                g.ma_giuong,
                p.ten_phong,
                nv.fullname as ten_bac_si
            FROM BenhNhan bn
            JOIN HoSoNhapVien hs ON bn.id = hs.benh_nhan_id
            LEFT JOIN Khoa k ON hs.khoa_id = k.id
            LEFT JOIN Giuong g ON hs.giuong_id = g.id
            LEFT JOIN Phong p ON g.phong_id = p.id
            LEFT JOIN users nv ON hs.bac_si_id = nv.id
            WHERE hs.trang_thai_ho_so != 'Đã xuất viện'
            ORDER BY hs.thoi_gian_nhap_vien DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/admission/:id/history', async (req, res) => {
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
});
app.post('/api/admission/history/add', async (req, res) => {
    console.log("Dữ liệu nhận được:", req.body);
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
});


//report 
app.get('/api/reports/summary', async (req, res) => {
    try {
        const stats = await pool.query(`
             SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM users WHERE role = 'Bác sĩ') as total_doctors,
                (SELECT COUNT(*) FROM users WHERE role = 'Y tá') as total_nurses,
                (SELECT COUNT(*) FROM hosonhapvien WHERE trang_thai_ho_so = 'Đang điều trị') as active_patients,
                (SELECT COUNT(*) FROM giuong) as total_beds,
                (SELECT COUNT(*) FROM giuong WHERE trang_thai = 'Đang sử dụng') as occupied_beds
            FROM (SELECT 1) AS dummy;
        `);

        const data = stats.rows[0];

        // Tính toán tỷ lệ lấp đầy
        const totalBeds = parseInt(data.total_beds) || 0;
        const occupiedBeds = parseInt(data.occupied_beds) || 0;
        const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

        res.json({
            ...data,
            occupancy_rate: occupancyRate + "%"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
});