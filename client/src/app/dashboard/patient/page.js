"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function PatientDashboard() {
  const [userId, setUserId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  // Custom medicine modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [medType, setMedType] = useState("medicine");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  
  // Dynamic time slots
  const [timeSlots, setTimeSlots] = useState(["08:00 AM"]);
  const [tempTime, setTempTime] = useState("08:00");

  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

  useEffect(() => {
    // Request permission for Web Notifications on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUserId(usr.uid);
        fetchData(usr.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Web Notifications Checker Loop
  useEffect(() => {
    const checkDoses = () => {
      if (!("Notification" in window) || Notification.permission !== "granted" || schedules.length === 0) return;

      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 hour should be 12
      const formattedCurrentTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

      schedules.forEach(s => {
        const slots = s.timeSlots || [];
        const records = s.adherenceRecord || [];
        
        slots.forEach(slot => {
          if (slot.time === formattedCurrentTime) {
            const isTaken = records.some(r => r.date === todayStr && r.timeSlot === slot.time && r.taken);
            if (!isTaken) {
              new Notification("💊 Medication Reminder", {
                body: `It's time to take your ${s.medicationName} (${s.dosage}). Instructions: ${s.instructions || 'No instructions'}`,
                icon: "/favicon.ico"
              });
            }
          }
        });
      });
    };

    // Run check immediately on load, and then every 60 seconds
    checkDoses();
    const intervalId = setInterval(checkDoses, 60000);
    return () => clearInterval(intervalId);
  }, [schedules]);

  const fetchData = async (uid) => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch User details (for phone number)
      const userRes = await fetch(`http://localhost:5000/api/auth/users/${uid}`);
      const userData = await userRes.json();
      if (userData.success && userData.data) {
        setPhoneInput(userData.data.phone || "");
      }

      // Fetch schedules
      const schedRes = await fetch(`http://localhost:5000/api/schedules/patient/${uid}`);
      const schedData = await schedRes.json();
      
      // Fetch appointments
      const apptRes = await fetch(`http://localhost:5000/api/appointments/patient/${uid}`);
      const apptData = await apptRes.json();

      if (schedData.success) setSchedules(schedData.data);
      if (apptData.success) setAppointments(apptData.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Unable to connect to the backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const updatePhoneNumber = async () => {
    if (!userId) return;
    try {
      setSyncing(true);
      setError("");
      const res = await fetch(`http://localhost:5000/api/auth/users/${userId}/phone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput })
      });
      const data = await res.json();
      if (data.success) {
        alert("Phone number updated successfully for SMS reminders!");
      } else {
        setError(data.error || "Failed to update phone number.");
      }
    } catch (err) {
      console.error("Error updating phone:", err);
      setError("Failed to sync phone number.");
    } finally {
      setSyncing(false);
    }
  };

  // Add custom medication schedule
  const addCustomMedication = async (e) => {
    e.preventDefault();
    if (!userId || !medName || !dosage) {
      setError("Please fill in the Medication Name and Dosage fields.");
      return;
    }
    try {
      setSyncing(true);
      setError("");

      const mappedTimeSlots = timeSlots.map(t => ({ time: t }));

      const res = await fetch("http://localhost:5000/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: userId,
          hospitalId: "hospital-system-001", // default assigned hospital
          medicationName: medName,
          dosage,
          type: medType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          timeSlots: mappedTimeSlots,
          instructions
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedules([...schedules, data.data]);
        // Reset form fields
        setMedName("");
        setDosage("");
        setMedType("medicine");
        setInstructions("");
        setTimeSlots(["08:00 AM"]);
        setIsAddModalOpen(false);
      } else {
        setError(data.error || "Failed to create medication schedule.");
      }
    } catch (err) {
      console.error("Error adding schedule:", err);
      setError("Failed to insert schedule record.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddTimeSlot = () => {
    if (!tempTime) return;
    const [hourStr, minStr] = tempTime.split(":");
    let hour = parseInt(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 hour should be 12
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minStr} ${ampm}`;

    if (!timeSlots.includes(formattedTime)) {
      setTimeSlots([...timeSlots, formattedTime]);
    }
  };

  const handleRemoveTimeSlot = (timeToRemove) => {
    setTimeSlots(timeSlots.filter(t => t !== timeToRemove));
  };

  // Add a test appointment to PostgreSQL
  const addTestAppointment = async () => {
    if (!userId) return;
    try {
      setSyncing(true);
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: userId,
          hospitalId: "hospital-system-001",
          title: "General Routine Consultation",
          description: "Routine checkup and prescription refill",
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
          time: "10:30 AM"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments([...appointments, data.data]);
      }
    } catch (err) {
      console.error("Error adding appointment:", err);
      setError("Failed to insert appointment record.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle dose taken state in database (persisted to JSONB adherenceRecord array)
  const toggleDose = async (scheduleId, time) => {
    try {
      const res = await fetch(`http://localhost:5000/api/schedules/${scheduleId}/toggle-dose`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: todayStr,
          timeSlot: time
        })
      });
      const data = await res.json();
      if (data.success) {
        setSchedules(schedules.map(s => s.id === scheduleId ? data.data : s));
      }
    } catch (err) {
      console.error("Error toggling dose:", err);
      setError("Failed to sync dose checkmark.");
    }
  };

  // Calculate compliance statistics
  const getAdherenceStats = () => {
    let totalSlotsCount = 0;
    let takenSlotsCount = 0;

    schedules.forEach((s) => {
      const slots = s.timeSlots || [];
      const records = s.adherenceRecord || [];
      totalSlotsCount += slots.length;
      
      slots.forEach((slot) => {
        const isTaken = records.some(r => r.date === todayStr && r.timeSlot === slot.time && r.taken);
        if (isTaken) takenSlotsCount++;
      });
    });

    const percent = totalSlotsCount > 0 ? Math.round((takenSlotsCount / totalSlotsCount) * 100) : 0;
    return { taken: takenSlotsCount, total: totalSlotsCount, percentage: percent };
  };

  const getNextAppointment = () => {
    if (appointments.length === 0) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const futureAppts = appointments.filter(a => {
      const apptDate = new Date(a.date);
      const apptDay = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate());
      return apptDay >= today;
    });

    if (futureAppts.length === 0) return null;
    futureAppts.sort((a, b) => new Date(a.date) - new Date(b.date));
    return futureAppts[0];
  };

  const stats = getAdherenceStats();
  const nextCheckup = getNextAppointment();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Syncing with database...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-2xl flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-teal-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-100 block mb-1">Mediguardian Patient Portal</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Hello, Patient! 👋
          </h2>
          <p className="text-sm font-semibold text-teal-50 mt-1 max-w-md">
            Here is your dynamic medical timeline. Checked-off doses are persisted directly into your PostgreSQL database.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-teal-100 block">Adherence Compliance</span>
          <span className="text-2xl font-extrabold">{stats.percentage}%</span>
        </div>
      </section>

      {/* Next Appointment check-up reminder alert */}
      {nextCheckup && (
        <div className="p-5 bg-gradient-to-br from-indigo-50 to-teal-50/20 border border-indigo-100 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div>
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Upcoming Doctor Appointment</span>
              <h4 className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{nextCheckup.title}</h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Scheduled on {new Date(nextCheckup.date).toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' })} at {nextCheckup.time}
              </p>
            </div>
          </div>
          <div className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
            Reminder Active
          </div>
        </div>
      )}

      {/* Database Seeding CTAs */}
      {schedules.length === 0 && (
        <section className="p-6 bg-teal-50 border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-teal-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your Database is Empty</h4>
            <p className="text-xs text-teal-600 font-medium">Create your first custom medication schedule or generate a sample appointment to test database synchronization!</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
            >
              💊 Add Medication
            </button>
            <button 
              onClick={addTestAppointment}
              disabled={syncing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md disabled:opacity-50"
            >
              📅 Add Appointment
            </button>
          </div>
        </section>
      )}

      {/* Stats Summary row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-bold">
            💊
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Today's Doses</span>
            <span className="text-base font-bold text-slate-800">{stats.taken} / {stats.total} Taken</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
            📅
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Active Appointments</span>
            <span className="text-base font-bold text-slate-800">{appointments.length} Scheduled</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
            🛡️
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Prescriptions</span>
            <span className="text-base font-bold text-slate-800">{schedules.length} Total</span>
          </div>
        </div>
      </section>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Schedules Checklist */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Medication Schedule
            </h3>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-teal-600 hover:text-teal-800 cursor-pointer"
            >
              + Add Medication
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {schedules.length === 0 ? (
              <p className="text-slate-400 text-xs font-medium text-center py-6">No medication schedules assigned to your profile yet.</p>
            ) : (
              schedules.flatMap(s => 
                (s.timeSlots || []).map(slot => {
                  const records = s.adherenceRecord || [];
                  const isTaken = records.some(r => r.date === todayStr && r.timeSlot === slot.time && r.taken);
                  
                  return (
                    <div 
                      key={`${s.id}-${slot.time}`}
                      onClick={() => toggleDose(s.id, slot.time)}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none ${
                        isTaken 
                          ? "bg-slate-50 border-slate-200" 
                          : "bg-white border-slate-100 shadow-sm hover:border-teal-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{isTaken ? "✅" : "💊"}</span>
                        <div>
                          <h4 className={`text-sm font-bold leading-tight ${isTaken ? "text-slate-400 line-through" : "text-slate-700"}`}>
                            {s.medicationName}
                          </h4>
                          <p className="text-xs text-slate-400 font-semibold">{s.dosage} • {s.instructions || 'No instructions'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">{slot.time}</span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Right Column: Appointments */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Appointments
              </h3>
              <button 
                onClick={addTestAppointment}
                disabled={syncing}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer disabled:opacity-50"
              >
                + Add
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {appointments.length === 0 ? (
                <p className="text-slate-400 text-xs font-medium text-center py-6">No appointments scheduled.</p>
              ) : (
                appointments.map(a => {
                  const formatOption = { month: "short", day: "numeric" };
                  const formattedDate = new Date(a.date).toLocaleDateString("en-US", formatOption);
                  
                  return (
                    <div key={a.id} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex flex-col gap-2 shadow-sm">
                      <span className="text-[9px] uppercase tracking-wide font-bold text-indigo-500">Consultation</span>
                      <h4 className="text-sm font-bold text-slate-700 leading-tight">{a.title}</h4>
                      <p className="text-xs text-slate-500">{a.description || 'No description'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">{formattedDate}</span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">{a.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SMS Notification Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                📱 SMS Reminders
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mobile Number</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. +15551234567"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-xs"
                  />
                  <button 
                    onClick={updatePhoneNumber}
                    disabled={syncing}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Enter your mobile number with country code (e.g., +1234567890) to receive automatic medication alerts via SMS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD CUSTOM MEDICATION MODAL FORM --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col gap-5 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                💊 Prescribe Custom Medication
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addCustomMedication} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medication Name</label>
                <input 
                  type="text" 
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Lipitor 10mg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dosage Amount</label>
                  <input 
                    type="text" 
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Tablet"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Type</label>
                  <select 
                    value={medType}
                    onChange={(e) => setMedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  >
                    <option value="medicine">Medicine / Pill</option>
                    <option value="injection">Injection</option>
                    <option value="vaccine">Vaccine Course</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">End Date</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Schedule Times</label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {timeSlots.map(time => (
                    <span 
                      key={time} 
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full"
                    >
                      {time}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTimeSlot(time)}
                        className="text-teal-400 hover:text-teal-800 font-bold ml-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {timeSlots.length === 0 && (
                    <span className="text-xs text-rose-500 font-medium">Add at least one daily dose time.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTimeSlot}
                    className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    + Add Time
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Special Instructions</label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take on an empty stomach with a full glass of water"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm h-20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={syncing || timeSlots.length === 0}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md disabled:opacity-50"
                >
                  {syncing ? "Saving..." : "Save Medication Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
