const express = require('express');
const router = express.Router();
const { createSchedule, getPatientSchedules, toggleDoseAdherence } = require('../controllers/scheduleController');

// POST /api/schedules - Create a schedule
router.post('/', createSchedule);

// GET /api/schedules/patient/:patientId - Fetch schedules for a patient
router.get('/patient/:patientId', getPatientSchedules);

// PUT /api/schedules/:scheduleId/toggle-dose - Toggle dose checkmark
router.put('/:scheduleId/toggle-dose', toggleDoseAdherence);

module.exports = router;
