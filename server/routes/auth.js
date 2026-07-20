const express = require('express');
const router = express.Router();
const { syncUser, getUsersByRole, linkCaregiver, getCaregiverPatients, updatePhone, getUserById } = require('../controllers/authController');

// POST /api/auth/sync
router.post('/sync', syncUser);

// GET /api/auth/users - Retrieve all users (e.g., query by role)
router.get('/users', getUsersByRole);

// GET /api/auth/users/:userId - Retrieve single user
router.get('/users/:userId', getUserById);

// PUT /api/auth/users/:patientId/link-caregiver - Link a caregiver to a patient
router.put('/users/:patientId/link-caregiver', linkCaregiver);

// GET /api/auth/caregiver/:caregiverId/patients - Get all patients linked to caregiver
router.get('/caregiver/:caregiverId/patients', getCaregiverPatients);

// PUT /api/auth/users/:userId/phone - Update phone number
router.put('/users/:userId/phone', updatePhone);

module.exports = router;
