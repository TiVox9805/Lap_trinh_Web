const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');

router.post('/add', admissionController.addAdmission);
router.get('/:id/history', admissionController.getAdmissionHistory);
router.post('/history/add', admissionController.addAdmissionHistory);
module.exports = router;