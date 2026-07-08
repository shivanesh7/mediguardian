"use client";
import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── SVG COMPONENT DEFINITIONS FOR NEW BACKGROUND ──

function BottleStanding() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      <defs>
        <linearGradient id="standBottleGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="75%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="whiteCapGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="18" y="10" width="64" height="20" rx="4" fill="url(#whiteCapGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
      <line x1="26" y1="10" x2="26" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="36" y1="10" x2="36" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="46" y1="10" x2="46" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="56" y1="10" x2="56" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="66" y1="10" x2="66" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="76" y1="10" x2="76" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      
      {/* Bottle neck */}
      <rect x="22" y="30" width="56" height="8" fill="#b45309" opacity="0.4" />
      
      {/* Bottle Body */}
      <rect x="15" y="38" width="70" height="84" rx="14" fill="url(#standBottleGrad)" />
      
      {/* White Label */}
      <path d="M 16,50 C 30,48 70,48 84,50 L 84,100 C 70,102 30,102 16,100 Z" fill="#ffffff" opacity="0.9" />
      
      {/* Label side accent shape */}
      <path d="M 68,60 C 74,68 74,82 68,90" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Gloss Reflection overlay */}
      <rect x="20" y="42" width="10" height="74" rx="5" fill="#ffffff" opacity="0.25" />
    </svg>
  );
}

function BottleTilted() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      <defs>
        <linearGradient id="tiltBottleGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="25%" stopColor="#d97706" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="whiteCapGrad2" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="55%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="18" y="10" width="64" height="20" rx="4" fill="url(#whiteCapGrad2)" stroke="#cbd5e1" strokeWidth="0.5" />
      <line x1="26" y1="10" x2="26" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="36" y1="10" x2="36" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="46" y1="10" x2="46" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="56" y1="10" x2="56" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="66" y1="10" x2="66" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
      
      {/* Body */}
      <rect x="15" y="30" width="70" height="90" rx="14" fill="url(#tiltBottleGrad)" />
      
      {/* Label */}
      <rect x="16" y="46" width="68" height="52" rx="4" fill="#fff5f0" opacity="0.9" />
      
      {/* Label circle logo */}
      <circle cx="50" cy="72" r="14" fill="#fdba74" opacity="0.5" />
      
      {/* Gloss Reflection overlay */}
      <rect x="20" y="34" width="8" height="80" rx="4" fill="#ffffff" opacity="0.2" />
    </svg>
  );
}

function SquarePillPeach() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="peachPillGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="50%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="60" height="60" rx="18" fill="url(#peachPillGrad)" />
      
      {/* Debossed indent markings */}
      <rect x="22" y="22" width="36" height="36" rx="6" stroke="#ea580c" strokeWidth="1.5" opacity="0.2" fill="none" />
      <line x1="40" y1="22" x2="40" y2="58" stroke="#ea580c" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
      <line x1="22" y1="40" x2="58" y2="40" stroke="#ea580c" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

function LargeSplitSphere() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      <defs>
        <radialGradient id="sphereTeal" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="45%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
        <radialGradient id="sphereYellow" cx="70%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        <clipPath id="leftHalfSphere">
          <rect x="0" y="0" width="40" height="80" />
        </clipPath>
        <clipPath id="rightHalfSphere">
          <rect x="40" y="0" width="40" height="80" />
        </clipPath>
      </defs>
      
      {/* Shadow layer */}
      <circle cx="40" cy="40" r="34" fill="#000" opacity="0.05" />
      
      {/* Left blue half */}
      <g clipPath="url(#leftHalfSphere)">
        <circle cx="40" cy="40" r="34" fill="url(#sphereTeal)" />
      </g>
      
      {/* Right yellow half */}
      <g clipPath="url(#rightHalfSphere)">
        <circle cx="40" cy="40" r="34" fill="url(#sphereYellow)" />
      </g>
      
      {/* Center partition seam line */}
      <line x1="40" y1="6" x2="40" y2="74" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
      
      {/* Shine reflection */}
      <ellipse cx="30" cy="24" rx="8" ry="4" fill="#ffffff" opacity="0.3" transform="rotate(-15 30 24)" />
    </svg>
  );
}

function SmallSplitSphere() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <radialGradient id="smSphereBlue" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#38bdf8" />
        </radialGradient>
        <radialGradient id="smSphereYellow" cx="70%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        <clipPath id="leftHalfSm">
          <rect x="0" y="0" width="30" height="60" />
        </clipPath>
        <clipPath id="rightHalfSm">
          <rect x="30" y="0" width="30" height="60" />
        </clipPath>
      </defs>
      <g clipPath="url(#leftHalfSm)">
        <circle cx="30" cy="30" r="24" fill="url(#smSphereBlue)" />
      </g>
      <g clipPath="url(#rightHalfSm)">
        <circle cx="30" cy="30" r="24" fill="url(#smSphereYellow)" />
      </g>
      <line x1="30" y1="6" x2="30" y2="54" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function PinkPillCross() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <defs>
        <linearGradient id="pinkCrossPill" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="60%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="24" fill="url(#pinkCrossPill)" />
      
      {/* Debossed split line and symbol */}
      <line x1="15" y1="30" x2="45" y2="30" stroke="#be185d" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
      <line x1="30" y1="15" x2="30" y2="45" stroke="#be185d" strokeWidth="2.5" opacity="0.35" strokeLinecap="round" />
      <circle cx="30" cy="30" r="24" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function YellowPillSymbol() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <defs>
        <linearGradient id="yellPillGrad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="22" fill="url(#yellPillGrad)" />
      <path d="M 20,30 Q 30,16 40,30 Q 30,44 20,30" stroke="#854d0e" strokeWidth="2.5" opacity="0.3" fill="none" />
      <circle cx="30" cy="30" r="2" fill="#854d0e" opacity="0.4" />
    </svg>
  );
}

function PinkWhiteCapsule() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="capsulePink" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="capsuleWhite" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <clipPath id="capsulePinkHalf">
          <rect x="0" y="0" width="40" height="45" rx="20" />
        </clipPath>
        <clipPath id="capsuleWhiteHalf">
          <rect x="0" y="45" width="40" height="45" rx="20" />
        </clipPath>
      </defs>
      <rect x="2" y="2" width="36" height="86" rx="18" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
      <g clipPath="url(#capsulePinkHalf)">
        <rect x="2" y="2" width="36" height="86" rx="18" fill="url(#capsulePink)" />
      </g>
      <g clipPath="url(#capsuleWhiteHalf)">
        <rect x="2" y="2" width="36" height="86" rx="18" fill="url(#capsuleWhite)" />
      </g>
      <line x1="2" y1="45" x2="38" y2="45" stroke="#000000" strokeWidth="1.5" opacity="0.08" />
      <path d="M 8,12 C 8,25 8,65 8,78" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.25" fill="none" />
    </svg>
  );
}

function ClockPill({ color }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
      <circle cx="25" cy="25" r="18" fill={color} opacity="0.8" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="25" cy="25" r="13" fill="#ffffff" />
      <line x1="25" y1="25" x2="25" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="25" x2="31" y2="25" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}


// ── MAIN LOGIN PAGE COMPONENT ──

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("patient");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const roles = [
    { id: "patient", label: "Patient", icon: "🧑‍⚕️", color: "#0d9488" },
    { id: "caregiver", label: "Caregiver", icon: "👨‍👩‍👧", color: "#0891b2" },
    { id: "hospital", label: "Hospital", icon: "🏥", color: "#0f766e" },
  ];

  const handleSign = async () => {
    setLoading(true); setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await fetch("http://localhost:5000/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, role: activeRole }),
      });

      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to sync with backend');
      }

      router.push(`/dashboard/${data.data.role}`);
      
    } catch (err) { 
      console.error(err);
      setError("Sign-in failed. Please try again."); 
    }
    finally { setLoading(false); }
  };

  // Configure the floating assets matching the light cyan reference photo (floating clustered on the right)
  const floatingElements = [
    // --- Orange Pill Bottles ---
    { id: "bottle-standing-right", type: "bottle-standing", depth: 0.75, animateClass: "animate-float-medium", style: { right: "20%", top: "34%", width: "135px", height: "175px", transform: "rotate(4deg) scale(1.05)" } },
    { id: "bottle-tilted-right", type: "bottle-tilted", depth: 0.9, animateClass: "animate-float-brisk", style: { right: "38%", bottom: "16%", width: "115px", height: "150px", transform: "rotate(-25deg)" } },

    // --- Pink & White Capsules ---
    { id: "caps-horizontal", type: "capsule", depth: 0.8, animateClass: "animate-float-brisk", style: { right: "22%", bottom: "8%", width: "32px", height: "72px", transform: "rotate(75deg)" } },
    { id: "caps-diagonal-top", type: "capsule", depth: 0.6, animateClass: "animate-float-medium", style: { right: "12%", top: "16%", width: "30px", height: "68px", transform: "rotate(50deg)" } },
    { id: "caps-diagonal-mid", type: "capsule", depth: 0.7, animateClass: "animate-float-gentle", style: { right: "43%", top: "38%", width: "32px", height: "70px", transform: "rotate(-38deg) scale(0.95)" } },
    { id: "caps-diagonal-right", type: "capsule", depth: 0.85, animateClass: "animate-float-medium", style: { right: "15%", top: "45%", width: "32px", height: "72px", transform: "rotate(25deg)" } },

    // --- Spheres ---
    { id: "sphere-split-large", type: "sphere-large", depth: 0.95, animateClass: "animate-float-sphere", style: { right: "14%", bottom: "14%", width: "95px", height: "95px" } },
    { id: "sphere-split-small", type: "sphere-small", depth: 0.5, animateClass: "animate-float-sphere", style: { right: "45%", top: "32%", width: "48px", height: "48px" } },

    // --- Flat Custom Pills ---
    { id: "pill-peach-square", type: "pill-square-peach", depth: 0.55, animateClass: "animate-float-gentle", style: { right: "24%", top: "14%", width: "70px", height: "70px", transform: "rotate(12deg)" } },
    { id: "pill-pink-cross", type: "pill-pink-cross", depth: 0.85, animateClass: "animate-float-brisk", style: { right: "28%", bottom: "24%", width: "56px", height: "56px", transform: "rotate(-10deg)" } },
    { id: "pill-yellow-symbol", type: "pill-yellow-symbol", depth: 0.65, animateClass: "animate-float-medium", style: { right: "32%", top: "45%", width: "54px", height: "54px", transform: "rotate(15deg)" } },

    // --- Clock Pills ---
    { id: "clock-pill-pink", type: "clock-pill", color: "#f472b6", depth: 0.45, animateClass: "animate-float-sphere", style: { right: "34%", top: "8%", width: "42px", height: "42px" } },
    { id: "clock-pill-yellow", type: "clock-pill", color: "#eab308", depth: 0.7, animateClass: "animate-float-sphere", style: { right: "8%", top: "33%", width: "38px", height: "38px" } },
    { id: "clock-pill-white", type: "clock-pill", color: "#cbd5e1", depth: 0.9, animateClass: "animate-float-sphere", style: { right: "50%", bottom: "34%", width: "35px", height: "35px" } },
  ];

  const renderFloatingElement = (el) => {
    // Parallax calculation
    const px = mousePos.x * el.depth * 40;
    const py = mousePos.y * el.depth * 40;

    const customStyle = {
      ...el.style,
      transform: `${el.style.transform || ""} translate3d(${px}px, ${py}px, 0)`,
      transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    let content = null;
    switch (el.type) {
      case "bottle-standing":
        content = <BottleStanding />;
        break;
      case "bottle-tilted":
        content = <BottleTilted />;
        break;
      case "pill-square-peach":
        content = <SquarePillPeach />;
        break;
      case "sphere-large":
        content = <LargeSplitSphere />;
        break;
      case "sphere-small":
        content = <SmallSplitSphere />;
        break;
      case "pill-pink-cross":
        content = <PinkPillCross />;
        break;
      case "pill-yellow-symbol":
        content = <YellowPillSymbol />;
        break;
      case "capsule":
        content = <PinkWhiteCapsule />;
        break;
      case "clock-pill":
        content = <ClockPill color={el.color} />;
        break;
      default:
        return null;
    }

    return (
      <div
        key={el.id}
        className={`absolute pointer-events-auto select-none transition-all duration-300 hover:scale-115 hover:rotate-12 cursor-pointer z-10 ${el.animateClass}`}
        style={customStyle}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#c6f2ee] via-[#dffaf6] to-[#d2f7f4] font-sans text-slate-800 flex items-center">
      
      {/* ── INTERACTIVE FLOATING ELEMENTS BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
        {floatingElements.map(renderFloatingElement)}
      </div>

      {/* Background elements overlay for tablet/mobile representation */}
      <div className="absolute w-[280px] h-[280px] bg-teal-200/30 rounded-full filter blur-[70px] -z-10 bottom-10 right-10 animate-float-pulse block lg:hidden" />

      {/* ── HEADER NAVIGATION ── */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 py-4 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-200/50 group-hover:scale-105 transition-transform duration-300">
            <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L6 9v10c0 7.73 5.14 14.91 12 16.94C24.86 33.91 30 26.73 30 19V9L18 3z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2"/>
              <path d="M14 19c0-2.21 1.49-4 3.33-4 .99 0 1.87.48 2.5 1.24C20.46 15.48 21.34 15 22.33 15c1.84 0 3.33 1.79 3.33 4 0 1.34-.57 2.53-1.47 3.33L18.5 26l-4.36-4C13.24 21.2 14 20.03 14 19z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Mediguardian
          </span>
        </Link>
        <Link href="/" className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors">
          ➔ Back to Home
        </Link>
      </header>

      {/* ── MAIN LAYOUT GRID ── */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: THE LOGIN CARD (PLACED IN THE FREE SPACE) */}
        <section 
          className="lg:col-span-5 flex justify-center lg:justify-start"
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -4}deg) rotateY(${mousePos.x * 4}deg) translateY(0px)`,
            transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div className="w-full max-w-[420px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-xl shadow-teal-500/5 rounded-[32px] p-8 md:p-10 flex flex-col gap-6 animate-float-pulse">
            
            <div className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-[10px] font-bold text-teal-600 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              Secure Gateway
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Welcome back 👋
              </h2>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                Choose your credential role and authenticate using Firebase to enter your portal.
              </p>
            </div>

            {/* Role selection tab grid */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Select Access Level</span>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 font-sans text-xs font-bold ${
                      activeRole === r.id
                        ? "bg-teal-500 border-teal-600 text-white shadow-md shadow-teal-200/50 scale-105"
                        : "bg-white/50 border-white/80 text-slate-600 hover:bg-white/80 hover:border-slate-300"
                    }`}
                    onClick={() => setActiveRole(r.id)}
                  >
                    <span className="text-lg">{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-slate-200" />
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Authentication</span>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>

            {/* Sign in with Google Button */}
            <button
              id="google-signin-btn"
              onClick={handleSign}
              disabled={loading}
              className="w-full py-4 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-md shadow-teal-200/50 hover:shadow-lg hover:shadow-teal-200/80 cursor-pointer transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#ffffff" opacity="0.8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#ffffff" opacity="0.7" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ffffff" opacity="0.9" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? "Authorizing Account..." : "Continue with Google"}
            </button>

            <div className="flex flex-col gap-1 items-center text-center mt-2">
              <div className="flex gap-4 justify-center text-[10px] font-bold text-slate-400 tracking-wide">
                <span>🛡️ HIPAA Secure</span>
                <span>🔒 Encrypted Link</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-2">
                Protected by Firebase Authentication.
              </span>
            </div>

          </div>
        </section>

        {/* RIGHT COLUMN: EMPTY SPACER (FLOATING ASSETS FILL THE BACKGROUND IN FRONT OF IT) */}
        <section className="lg:col-span-7 hidden lg:block" />

      </main>

      {/* ── FOOTER ── */}
      <footer className="absolute bottom-6 left-6 right-6 text-center text-[10px] font-bold text-teal-700/60 uppercase tracking-widest">
        Mediguardian Platform Security • Authorized Personnel Only
      </footer>

    </div>
  );
}
