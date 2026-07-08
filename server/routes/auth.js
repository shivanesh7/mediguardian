const express = require('express');
const router = express.Router();
const { syncUser, getUsersByRole, linkCaregiver, getCaregiverPatients } = require('../controllers/authController');

// POST /api/auth/sync
router.post('/sync', syncUser);

// GET /api/auth/users - Retrieve all users (e.g., query by role)
router.get('/users', getUsersByRole);

// PUT /api/auth/users/:patientId/link-caregiver - Link a caregiver to a patient
router.put('/users/:patientId/link-caregiver', linkCaregiver);

// GET /api/auth/caregiver/:caregiverId/patients - Get all patients linked to caregiver
router.get('/caregiver/:caregiverId/patients', getCaregiverPatients);

module.exports = router;
