// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Định nghĩa route POST cho login
router.post('/login', authController.login);
router.post('/change-password', authController.changePassword);

module.exports = router;