const cron = require('node-cron');
const { Op } = require('sequelize');
const Schedule = require('../models/Schedule');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Set up email transporter (simulate using console logs, or send using local SMTP/Ethereal mailer)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'mock-user@ethereal.email',
    pass: 'mock-pass'
  }
});

console.log('Background Medication Notification Service Initialized.');

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // Server local hour/minute formatted as "HH:MM AM/PM" (e.g. "09:00 AM")
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    const todayStr = now.toLocaleDateString("en-CA"); // YYYY-MM-DD

    // Fetch all schedules
    const schedules = await Schedule.findAll();
    
    for (const s of schedules) {
      // Check if start date and end date bracket today
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const eDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      if (todayDate >= sDate && todayDate <= eDate) {
        const slots = s.timeSlots || [];
        const hasSlotNow = slots.some(slot => slot.time === formattedTime);
        
        if (hasSlotNow) {
          const records = s.adherenceRecord || [];
          const isTaken = records.some(r => r.date === todayStr && r.timeSlot === formattedTime && r.taken);
          
          if (!isTaken) {
            // Find patient details
            const patient = await User.findByPk(s.patientId);
            if (patient) {
              console.log(`[EMAIL SIMULATION] Dose due for ${patient.name} (${patient.email}) - Medicine: ${s.medicationName}`);
              
              // Send simulated email
              try {
                const info = await transporter.sendMail({
                  from: '"Mediguardian Reminders" <reminders@mediguardian.com>',
                  to: patient.email,
                  subject: `💊 Medication Reminder: ${s.medicationName}`,
                  text: `Hello ${patient.name},\n\nThis is a friendly reminder to take your medication: ${s.medicationName} (${s.dosage}).\nInstructions: ${s.instructions || 'No instructions'}.\n\nScheduled time: ${formattedTime}.\n\nStay healthy,\nMediguardian Team`,
                  html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
                    <h2 style="color: #0d9488;">💊 Medication Reminder</h2>
                    <p>Hello <b>${patient.name}</b>,</p>
                    <p>This is a reminder to take your medication: <b>${s.medicationName} (${s.dosage})</b>.</p>
                    <p>Instructions: <i>${s.instructions || 'No instructions'}</i></p>
                    <p>Scheduled time: <b>${formattedTime}</b></p>
                    <br/>
                    <p style="color: #64748b; font-size: 11px;">Stay healthy,<br/>Mediguardian Team</p>
                  </div>`
                });

                console.log(`[EMAIL SIMULATION] Message sent: ${info.messageId}`);
                console.log(`[EMAIL SIMULATION] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
              } catch (mailError) {
                console.error('Error dispatching simulated email:', mailError.message);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error running Medication Notification Service cron job:', error);
  }
});
