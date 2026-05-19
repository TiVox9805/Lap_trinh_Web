const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Các đường dẫn API
router.get('/reports/:selectedMonth', adminController.getReports);
router.put('/managebeds/:id', adminController.updateStatusBed);
router.get('/bed-history/:id', adminController.getBedHistory);
router.get('/totalbeds', adminController.getTotalBeds);
router.patch('/delete-bed/:id', adminController.deleteBed);
router.post('/add-bed', adminController.addBed);
module.exports = router;