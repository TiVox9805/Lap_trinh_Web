const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/patient-records', patientController.getPatientRecords);
router.get('/inpatient', patientController.getInpatient);
router.patch('/discharge-order/:id', patientController.dischargeOrder);
router.get('/waiting-discharge', patientController.getWaitingDischarge);
router.patch('/complete-discharge/:id', patientController.completeDischarge);
module.exports = router;