const User = require('../models/User');
require('../config/firebase'); // ensure initialized
const { getAuth } = require('firebase-admin/auth');

exports.syncUser = async (req, res) => {
  try {
    const { token, role } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Firebase token is required' });
    }

    // Verify the Firebase token
    let decodedToken;
    try {
       decodedToken = await getAuth().verifyIdToken(token);
    } catch (verifyError) {
       console.error("Token Verification Failed:", verifyError);
       return res.status(401).json({ success: false, error: 'Invalid or expired Firebase token' });
    }

    const { uid, email, name, picture } = decodedToken;

    // Check if the user already exists in PostgreSQL
    let user = await User.findOne({ where: { googleId: uid } });

    if (!user) {
      // Create new user in PostgreSQL DB
      user = await User.create({
        id: uid, // Use Firebase UID directly as the Primary Key
        googleId: uid,
        email: email,
        name: name || email.split('@')[0], // Fallback name
        avatar: picture,
        role: role || 'patient', // Default role or from frontend
      });
    } else {
      // Update existing user properties if needed (like avatar)
      await user.update({ avatar: picture });
    }

    res.status(200).json({
      success: true,
      message: 'User synchronized successfully',
      data: {
        userId: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Error synchronizing user:', error);
    res.status(500).json({ success: false, error: 'Server error while synchronizing user' });
  }
};

// Get all users, filtered by role (e.g., patient)
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const whereClause = role ? { role } : {};
    const users = await User.findAll({ where: whereClause });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching users' });
  }
};

// Link a caregiver to a patient
exports.linkCaregiver = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { caregiverId } = req.body;

    const patient = await User.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    await patient.update({ caregiverId });
    res.status(200).json({ success: true, message: 'Caregiver linked successfully', data: patient });
  } catch (error) {
    console.error('Error linking caregiver:', error);
    res.status(500).json({ success: false, error: 'Server error while linking caregiver' });
  }
};

// Get all patients linked to a caregiver
exports.getCaregiverPatients = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const patients = await User.findAll({ where: { caregiverId, role: 'patient' } });
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching caregiver patients:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching patients' });
  }
};

// Update a user's phone number
exports.updatePhone = async (req, res) => {
  try {
    const { userId } = req.params;
    const { phone } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await user.update({ phone: phone || '' });
    res.status(200).json({ success: true, message: 'Phone number updated successfully', data: user });
  } catch (error) {
    console.error('Error updating phone number:', error);
    res.status(500).json({ success: false, error: 'Server error while updating phone number' });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching user profile' });
  }
};
