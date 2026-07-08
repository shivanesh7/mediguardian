const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, hospitalId, title, description, date, time } = req.body;

    if (!patientId || !hospitalId || !title || !date || !time) {
      return res.status(400).json({ success: false, error: 'Required fields are missing' });
    }

    // Ensure the patient exists in the Users table
    await User.findOrCreate({
      where: { id: patientId },
      defaults: {
        name: 'Default Patient',
        email: `patient-${patientId}@mediguardian.com`,
        role: 'patient'
      }
    });

    // Ensure the hospital exists in the Users table
    await User.findOrCreate({
      where: { id: hospitalId },
      defaults: {
        name: 'City Central Hospital',
        email: `hospital-${hospitalId}@mediguardian.com`,
        role: 'hospital'
      }
    });

    const appointment = await Appointment.create({
      patientId,
      hospitalId,
      title,
      description: description || '',
      date,
      time,
      status: 'scheduled'
    });

    res.status(201).json({ success: true, message: 'Appointment scheduled successfully', data: appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, error: 'Server error while scheduling appointment' });
  }
};

// Retrieve appointments for a specific patient
exports.getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.findAll({
      where: { patientId },
      order: [['date', 'ASC']]
    });
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching appointments' });
  }
};
