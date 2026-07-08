"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CaregiverDashboard() {
  const [caregiverId, setCaregiverId] = useState(null);
  
  // Database states
  const [linkedPatients, setLinkedPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSchedules, setPatientSchedules] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState("");
  const [showLinkSelector, setShowLinkSelector] = useState(false);
  const [patientIdToLink, setPatientIdToLink] = useState("");

  const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setCaregiverId(usr.uid);
        fetchCaregiverData(usr.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all caregiver patients, plus directory for linking
  const fetchCaregiverData = async (uid) => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch linked patients
      const linkedRes = await fetch(`http://localhost:5000/api/auth/caregiver/${uid}/patients`);
      const linkedData = await linkedRes.json();
      
      // Fetch all patients directory (for linking)
      const allRes = await fetch("http://localhost:5000/api/auth/users?role=patient");
      const allData = await allRes.json();

      if (linkedData.success) {
        setLinkedPatients(linkedData.data);
        if (linkedData.data.length > 0) {
          // Default select the first patient
          setSelectedPatient(linkedData.data[0]);
          fetchPatientDetails(linkedData.data[0].id);
        }
      }
      if (allData.success) {
        setAllPatients(allData.data);
      }
    } catch (err) {
      console.error("Error loading caregiver portal data:", err);
      setError("Unable to connect to the backend server. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (pid) => {
    try {
      const schedRes = await fetch(`http://localhost:5000/api/schedules/patient/${pid}`);
      const apptRes = await fetch(`http://localhost:5000/api/appointments/patient/${pid}`);
      const schedData = await schedRes.json();
      const apptData = await apptRes.json();

      if (schedData.success) setPatientSchedules(schedData.data);
      if (apptData.success) setPatientAppointments(apptData.data);
    } catch (err) {
      console.error("Error loading patient details:", err);
    }
  };

  const handlePatientSelect = (p) => {
    setSelectedPatient(p);
    setPatientSchedules([]);
    setPatientAppointments([]);
    fetchPatientDetails(p.id);
  };

  const handleLinkPatient = async (e) => {
    e.preventDefault();
    if (!patientIdToLink || !caregiverId) return;

    try {
      setLinking(true);
      setError("");
      const res = await fetch(`http://localhost:5000/api/auth/users/${patientIdToLink}/link-caregiver`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caregiverId })
      });
      const data = await res.json();
      if (data.success) {
        alert("Patient linked successfully!");
        setShowLinkSelector(false);
        setPatientIdToLink("");
        // Reload caregiver data
        fetchCaregiverData(caregiverId);
      } else {
        setError(data.error || "Failed to link patient.");
      }
    } catch (err) {
      console.error("Error linking patient:", err);
      setError("Failed to link patient.");
    } finally {
      setLinking(false);
    }
  };

  const togglePatientDose = async (scheduleId, time) => {
    if (!selectedPatient) return;
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
        setPatientSchedules(patientSchedules.map(s => s.id === scheduleId ? data.data : s));
      }
    } catch (err) {
      console.error("Error toggling dose:", err);
      setError("Failed to check off dose on behalf of patient.");
    }
  };

  const getCompliancePercent = (schedulesList) => {
    let totalSlots = 0;
    let takenSlots = 0;

    schedulesList.forEach((s) => {
      const slots = s.timeSlots || [];
      const records = s.adherenceRecord || [];
      totalSlots += slots.length;
      slots.forEach((slot) => {
        const isTaken = records.some(r => r.date === todayStr && r.timeSlot === slot.time && r.taken);
        if (isTaken) takenSlots++;
      });
    });

    return totalSlots > 0 ? Math.round((takenSlots / totalSlots) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading caregiver portal...</span>
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
      <section className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-teal-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-100 block mb-1">Mediguardian Caregiver Portal</span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Caregiver Monitor 👨‍👩‍👧
          </h2>
          <p className="text-sm font-semibold text-teal-50 mt-1 max-w-md">
            Observe prescription adherence, vaccine courses, and checkup timelines for family members under your care.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-teal-100 block">Monitored Accounts</span>
          <span className="text-2xl font-extrabold">{linkedPatients.length} Active</span>
        </div>
      </section>

      {/* Add / Link patient CTA */}
      <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200/60 rounded-2xl">
        <span className="text-xs font-bold text-slate-500">Need to monitor another patient?</span>
        <button 
          onClick={() => setShowLinkSelector(!showLinkSelector)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          {showLinkSelector ? "Close" : "+ Link Patient Account"}
        </button>
      </div>

      {showLinkSelector && (
        <form onSubmit={handleLinkPatient} className="p-5 bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 flex flex-col gap-1.5 w-full">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Patient from Directory</label>
            <select 
              value={patientIdToLink}
              onChange={(e) => setPatientIdToLink(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-700 text-xs font-bold bg-white"
              required
            >
              <option value="">-- Choose Patient --</option>
              {allPatients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={linking}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md disabled:opacity-50"
          >
            {linking ? "Linking..." : "Link Profile"}
          </button>
        </form>
      )}

      {linkedPatients.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center gap-3">
          <span className="text-4xl">👨‍👩‍👧</span>
          <h3 className="font-bold text-slate-700">No Patient Accounts Linked</h3>
          <p className="text-xs text-slate-400 max-w-sm">Use the "Link Patient Account" selector above to add patients and monitor their daily schedules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left panel: Patient select list */}
          <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Family Members</h3>
            <div className="flex flex-col gap-2">
              {linkedPatients.map(p => {
                const active = selectedPatient && selectedPatient.id === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => handlePatientSelect(p)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      active 
                        ? "bg-indigo-50/50 border-indigo-200" 
                        : "bg-white border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <h4 className="font-bold text-slate-800 text-xs">{p.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{p.email}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active patient details */}
          <div className="md:col-span-8 flex flex-col gap-6">
            {selectedPatient && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {selectedPatient.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{selectedPatient.email}</p>
                  </div>
                  <div className="bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[9px] uppercase font-bold text-teal-600 block leading-tight">Today Adherence</span>
                    <span className="text-sm font-extrabold text-teal-700">{getCompliancePercent(patientSchedules)}%</span>
                  </div>
                </div>

                {/* Progress bar compliance */}
                <div className="flex flex-col gap-1.5">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${getCompliancePercent(patientSchedules)}%` }}
                    />
                  </div>
                </div>

                {/* Medication checklist monitor */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mt-2">Medication Monitor</h4>
                  {patientSchedules.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4 font-semibold">No active medication schedules assigned.</p>
                  ) : (
                    patientSchedules.flatMap(s => 
                      (s.timeSlots || []).map(slot => {
                        const records = s.adherenceRecord || [];
                        const isTaken = records.some(r => r.date === todayStr && r.timeSlot === slot.time && r.taken);
                        
                        return (
                          <div 
                            key={`${s.id}-${slot.time}`}
                            onClick={() => togglePatientDose(s.id, slot.time)}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              isTaken ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200/80 shadow-sm hover:border-indigo-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{isTaken ? "✅" : "💊"}</span>
                              <div>
                                <h5 className={`text-xs font-bold ${isTaken ? "text-slate-400 line-through" : "text-slate-700"}`}>{s.medicationName}</h5>
                                <p className="text-[10px] text-slate-400 font-semibold">{s.dosage} • {s.instructions || 'No instructions'}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{slot.time}</span>
                          </div>
                        );
                      })
                    )
                  )}
                </div>

                {/* Next consultations checkups */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2 mt-2">Scheduled Checkups</h4>
                  {patientAppointments.length === 0 ? (
                    <p className="text-slate-400 text-xs text-center py-4 font-semibold">No checkup appointments scheduled.</p>
                  ) : (
                    patientAppointments.map(a => (
                      <div key={a.id} className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/20 flex flex-col gap-1.5">
                        <span className="text-[8px] uppercase tracking-wide font-extrabold text-indigo-500">Consultation</span>
                        <h5 className="text-xs font-bold text-slate-700 leading-tight">{a.title}</h5>
                        <div className="flex gap-2 text-[10px] font-bold text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded-md self-start">
                          <span>{new Date(a.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{a.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
