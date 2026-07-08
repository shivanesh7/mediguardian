const Schedule = require('../models/Schedule');
const User = require('../models/User');

// Create a new schedule (assigned to a patient)
exports.createSchedule = async (req, res) => {
  try {
    const { patientId, hospitalId, medicationName, dosage, type, startDate, endDate, timeSlots, instructions } = req.body;

    if (!patientId || !hospitalId || !medicationName || !dosage || !type || !startDate || !endDate) {
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

    const schedule = await Schedule.create({
      patientId,
      hospitalId,
      medicationName,
      dosage,
      type,
      startDate,
      endDate,
      timeSlots: timeSlots || [],
      adherenceRecord: [], // Empty initially
      instructions: instructions || ''
    });

    res.status(201).json({ success: true, message: 'Schedule created successfully', data: schedule });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ success: false, error: 'Server error while creating schedule' });
  }
};

// Retrieve all schedules assigned to a patient
exports.getPatientSchedules = async (req, res) => {
  try {
    const { patientId } = req.params;
    const schedules = await Schedule.findAll({ where: { patientId } });
    res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    console.error('Error fetching patient schedules:', error);
    res.status(500).json({ success: false, error: 'Server error while fetching schedules' });
  }
};

// Toggle a dose checkmark in the JSONB adherence record
exports.toggleDoseAdherence = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { date, timeSlot } = req.body;

    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, error: 'Date and timeSlot are required' });
    }

    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, error: 'Schedule not found' });
    }

    // Since adherenceRecord is JSONB, clone it to modify it
    let record = Array.isArray(schedule.adherenceRecord) ? [...schedule.adherenceRecord] : [];
    const index = record.findIndex(r => r.date === date && r.timeSlot === timeSlot);

    if (index !== -1) {
      // Toggle taken status
      record[index].taken = !record[index].taken;
      record[index].takenAt = record[index].taken ? new Date() : null;
    } else {
      // Add new taken record
      record.push({
        date,
        timeSlot,
        taken: true,
        takenAt: new Date()
      });
    }

    // Assign back and save
    schedule.adherenceRecord = record;
    // Tell Sequelize that this JSONB field has changed
    schedule.changed('adherenceRecord', true);
    await schedule.save();

    res.status(200).json({ success: true, message: 'Adherence toggled successfully', data: schedule });
  } catch (error) {
    console.error('Error toggling dose adherence:', error);
    res.status(500).json({ success: false, error: 'Server error while saving adherence' });
  }
};
