const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController')

router.post('/add-order', doctorController.addOrderEntry)
router.get('/history-order/:userId', doctorController.getHistoryOrder)
module.exports = router