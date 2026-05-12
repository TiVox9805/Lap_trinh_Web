const express = require('express');
const router = express.Router();
const bedsController = require('../controllers/bedsController');
const nurseController = require('../controllers/nurseController');
// Các đường dẫn API
router.get('/beds', bedsController.getAllInfoBeds);
router.get('/nurse/waiting-list', nurseController.waitingList);
router.post('/nurse/assign-bed', nurseController.assignBed);
router.get('/nurse/overview-stats', nurseController.getOverviewStats);
router.get('/nurse/pending-actions/:nurse_id', nurseController.getPendingActions);
router.get('/rooms', bedsController.getAllRooms);
module.exports = router;