"use client";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setUser({
          name: usr.displayName || usr.email.split("@")[0],
          email: usr.email,
          photo: usr.photoURL || "",
        });
      } else {
        // Redirect to login if user is not authenticated
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Securing Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 flex flex-col gap-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold">
              🛡️
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Mediguardian
            </span>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Portal Menu</span>
            <div className="px-3 py-2.5 bg-teal-50 text-teal-700 font-bold rounded-xl text-sm flex items-center gap-3">
              📊 Overview
            </div>
            <div className="px-3 py-2.5 hover:bg-slate-50 text-slate-400 font-semibold rounded-xl text-sm flex items-center gap-3 transition-colors cursor-not-allowed">
              📅 Appointments
            </div>
            <div className="px-3 py-2.5 hover:bg-slate-50 text-slate-400 font-semibold rounded-xl text-sm flex items-center gap-3 transition-colors cursor-not-allowed">
              ⚙️ Settings
            </div>
          </nav>
        </div>

        {/* Profile Card with Logout button */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-3">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1">
              {user.photo ? (
                <img src={user.photo} alt="Avatar" className="w-9 h-9 rounded-full border border-slate-200" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-slate-800 truncate">{user.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Environment Secured
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="md:hidden px-3.5 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all"
            >
              Sign Out
            </button>
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">HIPAA Certified Platform</span>
          </div>
        </header>

        {/* Page content window */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
