"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function HospitalDashboard() {
  const [hospitalId, setHospitalId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  // Prescribe Medication Modal State
  const [isPrescribeOpen, setIsPrescribeOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [medType, setMedType] = useState("medicine");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [timeSlots, setTimeSlots] = useState(["08:00 AM"]);
  const [tempTime, setTempTime] = useState("08:00");

  // Schedule Appointment Modal State
  const [isApptOpen, setIsApptOpen] = useState(false);
  const [selectedPatientIdForAppt, setSelectedPatientIdForAppt] = useState("");
  const [apptTitle, setApptTitle] = useState("");
  const [apptDescription, setApptDescription] = useState("");
  const [apptDate, setApptDate] = useState(new Date().toISOString().split("T")[0]);
  const [apptTime, setApptTime] = useState("10:30 AM");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setHospitalId(usr.uid);
        fetchPatients();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/auth/users?role=patient");
      const data = await res.json();
      if (data.success) {
        setPatients(data.data);
      } else {
        setError(data.error || "Failed to fetch patients.");
      }
    } catch (err) {
      console.error("Error loading patients:", err);
      setError("Unable to connect to the backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !medName || !dosage) {
      setError("All required fields must be completed.");
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
          patientId: selectedPatientId,
          hospitalId: hospitalId || "hospital-system-001",
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
        alert("Medication prescribed successfully!");
        setIsPrescribeOpen(false);
        // Reset form
        setSelectedPatientId("");
        setMedName("");
        setDosage("");
        setMedType("medicine");
        setInstructions("");
        setTimeSlots(["08:00 AM"]);
      } else {
        setError(data.error || "Failed to create medication schedule.");
      }
    } catch (err) {
      console.error("Error prescribing medication:", err);
      setError("Failed to prescribe medication.");
    } finally {
      setSyncing(false);
    }
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatientIdForAppt || !apptTitle || !apptDate || !apptTime) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSyncing(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatientIdForAppt,
          hospitalId: hospitalId || "hospital-system-001",
          title: apptTitle,
          description: apptDescription,
          date: new Date(apptDate),
          time: apptTime
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Consultation scheduled successfully!");
        setIsApptOpen(false);
        // Reset form
        setSelectedPatientIdForAppt("");
        setApptTitle("");
        setApptDescription("");
      } else {
        setError(data.error || "Failed to schedule appointment.");
      }
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      setError("Failed to schedule appointment.");
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
    hour = hour ? hour : 12;
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minStr} ${ampm}`;

    if (!timeSlots.includes(formattedTime)) {
      setTimeSlots([...timeSlots, formattedTime]);
    }
  };

  const handleRemoveTimeSlot = (timeToRemove) => {
    setTimeSlots(timeSlots.filter(t => t !== timeToRemove));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading patients database...</span>
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
      <section className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-teal-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-100 block mb-1">Mediguardian Hospital Portal</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            City General Hospital 🏥
          </h2>
          <p className="text-sm font-semibold text-teal-50 mt-1 max-w-md">
            Manage your patient schedules, assign doctor appointments, and check in real-time prescription compliance.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-teal-100 block">Registered Patients</span>
          <span className="text-2xl font-extrabold">{patients.length} Active</span>
        </div>
      </section>

      {/* Global Actions */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setIsPrescribeOpen(true)}
          className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all duration-200"
        >
          💊 Prescribe Medication
        </button>
        <button 
          onClick={() => setIsApptOpen(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all duration-200"
        >
          📅 Schedule Patient Checkup
        </button>
      </div>

      {/* Patients queue */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Patient Admittance & Directory
          </h3>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">Live Database</span>
        </div>

        <div className="overflow-x-auto">
          {patients.length === 0 ? (
            <p className="text-slate-400 text-xs font-medium text-center py-6">No patients registered in the database.</p>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Patient ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 font-mono text-[10px] text-slate-400">{p.id}</td>
                    <td className="py-4 px-2 font-bold text-slate-700">{p.name}</td>
                    <td className="py-4 px-2 font-semibold text-slate-500">{p.email}</td>
                    <td className="py-4 px-2 text-slate-500 uppercase text-[10px] font-bold">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">Patient</span>
                    </td>
                    <td className="py-4 px-2 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setIsPrescribeOpen(true);
                        }}
                        className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        💊 Prescribe
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedPatientIdForAppt(p.id);
                          setIsApptOpen(true);
                        }}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                      >
                        📅 Schedule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- PRESCRIBE MEDICATION MODAL FORM --- */}
      {isPrescribeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col gap-5 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                💊 Prescribe Medication
              </h3>
              <button onClick={() => setIsPrescribeOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handlePrescribe} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Patient</label>
                <select 
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medication Name</label>
                <input 
                  type="text" 
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  placeholder="e.g. Metformin 500mg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dosage</label>
                  <input 
                    type="text" 
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 1 Pill"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</label>
                  <select 
                    value={medType}
                    onChange={(e) => setMedType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  >
                    <option value="medicine">Medicine / Pill</option>
                    <option value="injection">Injection</option>
                    <option value="vaccine">Vaccine</option>
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

              {/* Time Slots */}
              <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Schedule Times</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {timeSlots.map(time => (
                    <span key={time} className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full">
                      {time}
                      <button type="button" onClick={() => handleRemoveTimeSlot(time)} className="text-teal-400 hover:text-teal-800 font-bold ml-1 cursor-pointer">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={tempTime}
                    onChange={(e) => setTempTime(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  />
                  <button type="button" onClick={handleAddTimeSlot} className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 text-xs font-bold rounded-xl cursor-pointer">+ Add Time</button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Instructions</label>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take after eating"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setIsPrescribeOpen(false)} className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" disabled={syncing || timeSlots.length === 0} className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md disabled:opacity-50">Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SCHEDULE APPOINTMENT MODAL FORM --- */}
      {isApptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col gap-5 relative overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                📅 Schedule Doctor Consult / Checkup
              </h3>
              <button onClick={() => setIsApptOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleScheduleAppointment} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Patient</label>
                <select 
                  value={selectedPatientIdForAppt}
                  onChange={(e) => setSelectedPatientIdForAppt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Title</label>
                <input 
                  type="text" 
                  value={apptTitle}
                  onChange={(e) => setApptTitle(e.target.value)}
                  placeholder="e.g. Heart Rate Checkup / Pediatric Vaccine"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Description</label>
                <textarea 
                  value={apptDescription}
                  onChange={(e) => setApptDescription(e.target.value)}
                  placeholder="e.g. Patient must bring reports"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultation Date</label>
                  <input 
                    type="date" 
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Scheduled Time</label>
                  <input 
                    type="text" 
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white/50 text-slate-700 font-semibold text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setIsApptOpen(false)} className="px-4 py-2.5 text-slate-500 hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
                <button type="submit" disabled={syncing} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md">Schedule Consultation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
