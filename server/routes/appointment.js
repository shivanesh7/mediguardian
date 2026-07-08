const express = require('express');
const router = express.Router();
const { createAppointment, getPatientAppointments } = require('../controllers/appointmentController');

// POST /api/appointments - Schedule consult
router.post('/', createAppointment);

// GET /api/appointments/patient/:patientId - Fetch appointments
router.get('/patient/:patientId', getPatientAppointments);

module.exports = router;
