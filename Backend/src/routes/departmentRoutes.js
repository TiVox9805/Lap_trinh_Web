const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Định nghĩa route GET để lấy danh sách khoa
router.get('/', departmentController.getAllDepartments);
module.exports = router;