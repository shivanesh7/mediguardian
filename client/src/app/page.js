"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── SVG FLOATING COMPONENT DEFINITIONS ──

function AlarmClockBlue() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="blueClockBody" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="blueClockFace" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>
        <linearGradient id="bellGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      {/* Legs */}
      <rect x="22" y="88" width="12" height="15" rx="6" transform="rotate(25 22 88)" fill="#475569" />
      <rect x="66" y="88" width="12" height="15" rx="6" transform="rotate(-25 66 88)" fill="#475569" />
      {/* Bells */}
      <path d="M 15,35 A 18,18 0 0 1 45,20 L 38,40 Z" fill="url(#bellGrad)" />
      <path d="M 85,35 A 18,18 0 0 0 55,20 L 62,40 Z" fill="url(#bellGrad)" />
      {/* Handle */}
      <path d="M 40,15 C 40,5 60,5 60,15" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Outer Case */}
      <circle cx="50" cy="55" r="40" fill="url(#blueClockBody)" stroke="#1d4ed8" strokeWidth="2" />
      {/* Clock Face */}
      <circle cx="50" cy="55" r="32" fill="url(#blueClockFace)" />
      {/* Hour Marks */}
      <circle cx="50" cy="29" r="1.5" fill="#1e293b" />
      <circle cx="50" cy="81" r="1.5" fill="#1e293b" />
      <circle cx="24" cy="55" r="1.5" fill="#1e293b" />
      <circle cx="76" cy="55" r="1.5" fill="#1e293b" />
      {/* Hands */}
      <line x1="50" y1="55" x2="50" y2="38" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="55" x2="68" y2="55" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" transform="rotate(20 50 55)" />
      {/* Center Pin */}
      <circle cx="50" cy="55" r="3" fill="#ef4444" />
    </svg>
  );
}

function AlarmClockPurple() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="purpleClockBody" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <radialGradient id="purpleClockFace" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5f3ff" />
        </radialGradient>
        <linearGradient id="purpleBellGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
      </defs>
      {/* Legs */}
      <rect x="22" y="88" width="12" height="15" rx="6" transform="rotate(25 22 88)" fill="#64748b" />
      <rect x="66" y="88" width="12" height="15" rx="6" transform="rotate(-25 66 88)" fill="#64748b" />
      {/* Bells */}
      <path d="M 15,35 A 18,18 0 0 1 45,20 L 38,40 Z" fill="url(#purpleBellGrad)" />
      <path d="M 85,35 A 18,18 0 0 0 55,20 L 62,40 Z" fill="url(#purpleBellGrad)" />
      {/* Handle */}
      <path d="M 40,15 C 40,5 60,5 60,15" stroke="#64748b" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Outer Case */}
      <circle cx="50" cy="55" r="40" fill="url(#purpleClockBody)" stroke="#6d28d9" strokeWidth="2" />
      {/* Clock Face */}
      <circle cx="50" cy="55" r="32" fill="url(#purpleClockFace)" />
      {/* Hands */}
      <line x1="50" y1="55" x2="50" y2="40" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" transform="rotate(-30 50 55)" />
      <line x1="50" y1="55" x2="65" y2="55" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" transform="rotate(110 50 55)" />
      {/* Center Pin */}
      <circle cx="50" cy="55" r="3.5" fill="#ec4899" />
    </svg>
  );
}

function OrangeClockPillBottle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 90 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="orangeBottleGrad" x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="25%" stopColor="#f97316" />
          <stop offset="75%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="capGrad" x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      {/* Ribbed Cap */}
      <rect x="10" y="5" width="70" height="18" rx="4" fill="url(#capGrad)" stroke="#94a3b8" strokeWidth="1" />
      <line x1="20" y1="5" x2="20" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="30" y1="5" x2="30" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="40" y1="5" x2="40" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="50" y1="5" x2="50" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="60" y1="5" x2="60" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      <line x1="70" y1="5" x2="70" y2="23" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Bottle neck */}
      <rect x="15" y="23" width="60" height="8" fill="#c2410c" opacity="0.6" />
      
      {/* Bottle Body */}
      <rect x="12" y="31" width="66" height="84" rx="12" fill="url(#orangeBottleGrad)" />
      
      {/* Gloss reflection overlay */}
      <rect x="16" y="35" width="10" height="76" rx="5" fill="#ffffff" opacity="0.25" />
      
      {/* White Label */}
      <rect x="18" y="45" width="54" height="52" rx="4" fill="#fffaf8" stroke="#fed7aa" strokeWidth="1" />
      
      {/* Clock Face on Label */}
      <circle cx="45" cy="71" r="18" stroke="#f97316" strokeWidth="2.5" fill="#fff" />
      <line x1="45" y1="71" x2="45" y2="60" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="45" y1="71" x2="55" y2="75" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="45" cy="71" r="2" fill="#ea580c" />
    </svg>
  );
}

function GreenCrossPillBottle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 95 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="greenBottleGrad" x1="0" y1="0" x2="95" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="25%" stopColor="#0d9488" />
          <stop offset="75%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="whiteCap" x1="0" y1="0" x2="95" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      {/* Squat Cap */}
      <rect x="18" y="8" width="59" height="15" rx="3" fill="url(#whiteCap)" stroke="#64748b" strokeWidth="0.5" />
      {/* Squat Body */}
      <rect x="15" y="23" width="65" height="78" rx="14" fill="url(#greenBottleGrad)" />
      {/* Highlight reflection */}
      <rect x="20" y="27" width="8" height="70" rx="4" fill="#ffffff" opacity="0.2" />
      {/* Label */}
      <rect x="20" y="40" width="55" height="46" rx="3" fill="#ffffff" />
      {/* Red Cross */}
      <rect x="42" y="48" width="11" height="30" rx="2" fill="#ef4444" />
      <rect x="32" y="58" width="31" height="11" rx="2" fill="#ef4444" />
    </svg>
  );
}

function WhiteBluePillBottle() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 90 125" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="whiteBottleGrad" x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="30%" stopColor="#f8fafc" />
          <stop offset="80%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="blueLabelGrad" x1="0" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      {/* Cap */}
      <rect x="15" y="6" width="60" height="16" rx="3" fill="url(#whiteBottleGrad)" stroke="#94a3b8" strokeWidth="0.5" />
      {/* Body */}
      <rect x="12" y="22" width="66" height="92" rx="10" fill="url(#whiteBottleGrad)" stroke="#cbd5e1" strokeWidth="0.5" />
      {/* Blue Label */}
      <rect x="13" y="42" width="64" height="54" fill="url(#blueLabelGrad)" />
      {/* Label Logo */}
      <circle cx="45" cy="69" r="17" fill="#ffffff" />
      {/* Orange Cross in Label */}
      <rect x="41" y="58" width="8" height="22" rx="1.5" fill="#f97316" />
      <rect x="34" y="65" width="22" height="8" rx="1.5" fill="#f97316" />
    </svg>
  );
}

function FirstAidBoxMagenta() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      <defs>
        <linearGradient id="magentaBoxGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#db2777" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
      </defs>
      {/* Main Square rounded */}
      <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#magentaBoxGrad)" />
      {/* Gloss Reflection */}
      <path d="M 18,18 C 30,12 70,12 82,18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.3" fill="none" />
      {/* White Cross Circle */}
      <circle cx="50" cy="50" r="24" fill="#ffffff" />
      {/* Magenta Cross */}
      <rect x="44" y="34" width="12" height="32" rx="3" fill="#db2777" />
      <rect x="34" y="44" width="32" height="12" rx="3" fill="#db2777" />
    </svg>
  );
}

function CapsulePill({ primaryColor, secondaryColor }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 40 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <defs>
        <linearGradient id="primaryHalf" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} opacity="0.9" />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={primaryColor} opacity="0.8" />
        </linearGradient>
        <linearGradient id="secondaryHalf" x1="0" y1="0" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={secondaryColor} opacity="0.9" />
          <stop offset="50%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={secondaryColor} opacity="0.8" />
        </linearGradient>
        <clipPath id="topCapsuleClip">
          <rect x="0" y="0" width="40" height="45" rx="20" />
        </clipPath>
        <clipPath id="bottomCapsuleClip">
          <rect x="0" y="45" width="40" height="45" rx="20" />
        </clipPath>
      </defs>
      
      {/* Shadow & Outline Outer pill */}
      <rect x="2" y="2" width="36" height="86" rx="18" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
      
      {/* Top Half */}
      <g clipPath="url(#topCapsuleClip)">
        <rect x="2" y="2" width="36" height="86" rx="18" fill="url(#primaryHalf)" />
      </g>
      
      {/* Bottom Half */}
      <g clipPath="url(#bottomCapsuleClip)">
        <rect x="2" y="2" width="36" height="86" rx="18" fill="url(#secondaryHalf)" />
      </g>
      
      {/* Center seam shadow */}
      <line x1="2" y1="45" x2="38" y2="45" stroke="#000000" strokeWidth="2" opacity="0.1" />
      <line x1="2" y1="46" x2="38" y2="46" stroke="#ffffff" strokeWidth="1" opacity="0.2" />

      {/* Shine reflection overlay */}
      <path d="M 8,10 C 8,25 8,65 8,80" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.25" fill="none" />
    </svg>
  );
}

function Sphere3D({ color1, color2 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
      <defs>
        <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="40%" stopColor={color2} />
          <stop offset="100%" stopColor={color2} opacity="0.9" />
        </radialGradient>
      </defs>
      <circle cx="25" cy="25" r="22" fill="url(#sphereGrad)" />
      {/* Specular highlights */}
      <circle cx="18" cy="18" r="5" fill="#ffffff" opacity="0.3" filter="blur(1px)" />
    </svg>
  );
}

function TranslucentPillCup() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
      <defs>
        <linearGradient id="cupRim" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" opacity="0.6" />
          <stop offset="100%" stopColor="#cbd5e1" opacity="0.3" />
        </linearGradient>
      </defs>
      {/* Pills Inside */}
      <g opacity="0.8">
        {/* Little colored circles representing pills inside cup */}
        <circle cx="40" cy="65" r="6" fill="#f97316" />
        <circle cx="55" cy="70" r="5" fill="#3b82f6" />
        <circle cx="48" cy="75" r="5.5" fill="#a855f7" />
        <circle cx="62" cy="62" r="6" fill="#10b981" />
      </g>
      {/* Translucent Cup Bowl */}
      <path d="M 20,40 C 20,80 80,80 80,40 Z" fill="rgba(255, 255, 255, 0.25)" stroke="url(#cupRim)" strokeWidth="3" />
      {/* Reflection shine lines */}
      <path d="M 28,48 C 28,70 72,70 72,48" stroke="#ffffff" strokeWidth="1.5" opacity="0.25" fill="none" />
      <ellipse cx="50" cy="40" rx="30" ry="8" fill="rgba(255, 255, 255, 0.15)" stroke="url(#cupRim)" strokeWidth="2" />
    </svg>
  );
}


// ── MAIN LANDING PAGE COMPONENT ──

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Configure the floating assets based on the reference layout image
  const floatingElements = [
    // --- Alarm Clocks ---
    { id: "clock-purple-left", type: "clock-purple", depth: 0.75, animateClass: "animate-float-brisk", style: { left: "4%", top: "33%", width: "120px", height: "130px", transform: "rotate(-18deg) scale(0.9)" } },
    { id: "clock-blue-right", type: "clock-blue", depth: 0.65, animateClass: "animate-float-medium", style: { right: "10%", top: "18%", width: "130px", height: "140px", transform: "rotate(15deg) scale(0.95)" } },

    // --- Pill Bottles ---
    { id: "bottle-orange-clock-bottom", type: "bottle-orange-clock", depth: 0.85, animateClass: "animate-float-gentle", style: { left: "42%", bottom: "16%", width: "110px", height: "140px", transform: "rotate(20deg)" } },
    { id: "bottle-green-cross-bottom", type: "bottle-green-cross", depth: 0.7, animateClass: "animate-float-medium", style: { right: "12%", bottom: "14%", width: "120px", height: "135px", transform: "rotate(-10deg) scale(1.05)" } },
    { id: "bottle-white-blue-right", type: "bottle-white-blue", depth: 0.5, animateClass: "animate-float-brisk", style: { right: "2%", top: "42%", width: "115px", height: "155px", transform: "rotate(12deg) scale(1)" } },
    { id: "box-magenta-cross-left", type: "box-magenta-cross", depth: 0.9, animateClass: "animate-float-medium", style: { left: "2%", bottom: "22%", width: "125px", height: "125px", transform: "rotate(-15deg)" } },
    { id: "bottle-orange-top-left", type: "bottle-orange-clock", depth: 0.4, animateClass: "animate-float-gentle", style: { left: "2%", top: "4%", width: "90px", height: "115px", transform: "rotate(-25deg) scale(0.8)" } },

    // --- Translucent Cup ---
    { id: "translucent-cup-left", type: "cup-translucent", depth: 0.95, animateClass: "animate-float-brisk", style: { left: "14%", bottom: "8%", width: "135px", height: "135px", transform: "rotate(10deg)" } },

    // --- Capsules ---
    { id: "capsule-purple-1", type: "capsule", colors: ["#a855f7", "#ffffff"], depth: 0.8, animateClass: "animate-float-brisk", style: { left: "30%", top: "25%", width: "32px", height: "72px", transform: "rotate(55deg)" } },
    { id: "capsule-blue-1", type: "capsule", colors: ["#3b82f6", "#2dd4bf"], depth: 0.7, animateClass: "animate-float-medium", style: { right: "26%", bottom: "42%", width: "30px", height: "68px", transform: "rotate(-40deg)" } },
    { id: "capsule-orange-1", type: "capsule", colors: ["#f97316", "#fed7aa"], depth: 0.55, animateClass: "animate-float-gentle", style: { left: "20%", bottom: "38%", width: "28px", height: "64px", transform: "rotate(15deg)" } },
    { id: "capsule-pink-1", type: "capsule", colors: ["#ec4899", "#ffedd5"], depth: 0.9, animateClass: "animate-float-medium", style: { left: "55%", top: "23%", width: "34px", height: "76px", transform: "rotate(-30deg)" } },
    { id: "capsule-blue-teal-2", type: "capsule", colors: ["#0ea5e9", "#0f766e"], depth: 0.65, animateClass: "animate-float-brisk", style: { left: "53%", bottom: "4%", width: "32px", height: "72px", transform: "rotate(35deg)" } },
    { id: "capsule-green-yellow", type: "capsule", colors: ["#10b981", "#fbbf24"], depth: 0.75, animateClass: "animate-float-gentle", style: { right: "38%", bottom: "12%", width: "30px", height: "68px", transform: "rotate(-65deg)" } },

    // --- Spheres ---
    { id: "sphere-yellow-1", type: "sphere", colors: ["#fef08a", "#eab308"], depth: 0.45, animateClass: "animate-float-sphere", style: { left: "35%", top: "4%", width: "42px", height: "42px" } },
    { id: "sphere-blue-1", type: "sphere", colors: ["#bfdbfe", "#2563eb"], depth: 0.35, animateClass: "animate-float-sphere", style: { left: "24%", top: "36%", width: "35px", height: "35px" } },
    { id: "sphere-green-1", type: "sphere", colors: ["#bbf7d0", "#16a34a"], depth: 0.6, animateClass: "animate-float-sphere", style: { left: "15%", top: "48%", width: "38px", height: "38px" } },
    { id: "sphere-violet-1", type: "sphere", colors: ["#e9d5ff", "#7c3aed"], depth: 0.5, animateClass: "animate-float-sphere", style: { right: "18%", top: "40%", width: "30px", height: "30px" } },
    { id: "sphere-yellow-2", type: "sphere", colors: ["#fef9c3", "#f59e0b"], depth: 0.8, animateClass: "animate-float-sphere", style: { right: "4%", top: "32%", width: "48px", height: "48px" } },
    { id: "sphere-orange-1", type: "sphere", colors: ["#ffedd5", "#f97316"], depth: 0.7, animateClass: "animate-float-sphere", style: { left: "20%", bottom: "45%", width: "32px", height: "32px" } },
    { id: "sphere-blue-2", type: "sphere", colors: ["#dbeafe", "#3b82f6"], depth: 0.55, animateClass: "animate-float-sphere", style: { right: "46%", top: "74%", width: "34px", height: "34px" } },
    { id: "sphere-blue-small", type: "sphere", colors: ["#e0f2fe", "#0284c7"], depth: 0.3, animateClass: "animate-float-sphere", style: { right: "8%", top: "6%", width: "24px", height: "24px" } },
  ];

  const renderFloatingElement = (el) => {
    // Parallax calculation
    const px = mousePos.x * el.depth * 45;
    const py = mousePos.y * el.depth * 45;
    
    // Merge base styles with hover transition and dynamic parallax translate
    const customStyle = {
      ...el.style,
      transform: `${el.style.transform || ""} translate3d(${px}px, ${py}px, 0)`,
      transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };

    let content = null;
    switch (el.type) {
      case "clock-purple":
        content = <AlarmClockPurple />;
        break;
      case "clock-blue":
        content = <AlarmClockBlue />;
        break;
      case "bottle-orange-clock":
        content = <OrangeClockPillBottle />;
        break;
      case "bottle-green-cross":
        content = <GreenCrossPillBottle />;
        break;
      case "bottle-white-blue":
        content = <WhiteBluePillBottle />;
        break;
      case "box-magenta-cross":
        content = <FirstAidBoxMagenta />;
        break;
      case "cup-translucent":
        content = <TranslucentPillCup />;
        break;
      case "capsule":
        content = <CapsulePill primaryColor={el.colors[0]} secondaryColor={el.colors[1]} />;
        break;
      case "sphere":
        content = <Sphere3D color1={el.colors[0]} color2={el.colors[1]} />;
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#ffdcd8] via-[#ffebf0] to-[#ffd9e2] font-sans text-slate-800">
      
      {/* ── INTERACTIVE FLOATING ELEMENTS BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {floatingElements.map(renderFloatingElement)}
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-30 px-6 py-4 md:px-12 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 via-purple-500 to-orange-400 flex items-center justify-center shadow-md shadow-rose-200">
            <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
              <path d="M18 3L6 9v10c0 7.73 5.14 14.91 12 16.94C24.86 33.91 30 26.73 30 19V9L18 3z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2"/>
              <path d="M14 19c0-2.21 1.49-4 3.33-4 .99 0 1.87.48 2.5 1.24C20.46 15.48 21.34 15 22.33 15c1.84 0 3.33 1.79 3.33 4 0 1.34-.57 2.53-1.47 3.33L18.5 26l-4.36-4C13.24 21.2 14 20.03 14 19z" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-purple-700 via-rose-600 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Mediguardian
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-full font-semibold text-sm border border-rose-200/50 text-rose-700 hover:bg-white/50 transition-all duration-300 backdrop-blur-sm shadow-sm glass-button">
            Sign In
          </Link>
        </div>
      </header>

      {/* ── HERO LAYOUT ── */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)]">
        
        {/* LEFT COLUMN: HERO PANEL */}
        <section className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left pointer-events-auto">
          {/* Tagline Badge */}
          <div className="self-center lg:self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-rose-100 text-rose-600 text-xs font-bold tracking-wider uppercase shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Healthcare, Optimized
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Never miss a dose. <br />
            <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-float-pulse inline-block">
              Your smart guardian.
            </span>
          </h1>

          <p className="max-w-xl text-base md:text-lg text-slate-600 font-medium leading-relaxed">
            Mediguardian is the ultimate system for managing smart medicine schedules, baby vaccination courses, and scheduling direct links to care facilities. Perfect for patients, caregivers, and hospitals.
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            <div className="p-4 rounded-2xl bg-white/45 border border-white/60 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300">
              <span className="block text-2xl font-bold text-rose-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>⏰ 100%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adherence</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/45 border border-white/60 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300">
              <span className="block text-2xl font-bold text-purple-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>💉 Newborn</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vaccine Tracking</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/45 border border-white/60 shadow-sm backdrop-blur-md hover:shadow-md transition-all duration-300">
              <span className="block text-2xl font-bold text-indigo-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>🏥 Integrated</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hospital Portal</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mt-2">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-rose-500 via-rose-600 to-purple-600 text-white text-base font-bold rounded-2xl shadow-lg shadow-rose-300/40 hover:shadow-xl hover:shadow-rose-300/60 transform hover:-translate-y-0.5 transition-all duration-300 text-center">
              Get Started Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white/60 border border-white/80 text-rose-700 text-base font-bold rounded-2xl shadow-sm hover:bg-white/80 hover:shadow-md transition-all duration-300 backdrop-blur-sm text-center">
              Explore Demo Dashboard ➔
            </Link>
          </div>
        </section>

        {/* RIGHT COLUMN: INTERACTIVE SMARTPHONE CONTAINER */}
        <section className="lg:col-span-6 flex items-center justify-center relative pointer-events-auto py-10">
          
          {/* Radial ambient glow behind smartphone */}
          <div className="absolute w-[350px] h-[350px] bg-gradient-to-r from-rose-300 to-purple-300 opacity-40 rounded-full filter blur-[80px] -z-10 animate-float-pulse" />

          {/* Smartphone Mockup Container */}
          <div 
            className="w-[300px] h-[610px] rounded-[48px] border-[11px] border-slate-900 bg-slate-900 shadow-2xl relative select-none animate-float-gentle"
            style={{
              boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25), 0px 0px 50px 10px rgba(251, 113, 133, 0.15)",
              transform: `perspective(1000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg) translateY(0px)`,
              transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Phone Notch/Speaker */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-1.5" />
            </div>

            {/* Side Buttons details */}
            <div className="absolute -left-[14px] top-24 w-[3px] h-12 bg-slate-800 rounded-l" />
            <div className="absolute -left-[14px] top-40 w-[3px] h-16 bg-slate-800 rounded-l" />
            <div className="absolute -left-[14px] top-60 w-[3px] h-16 bg-slate-800 rounded-l" />
            <div className="absolute -right-[14px] top-36 w-[3px] h-20 bg-slate-800 rounded-r" />

            {/* Screen Inner Container */}
            <div className="w-full h-full rounded-[38px] overflow-hidden bg-slate-50 relative flex flex-col p-4 pt-7 text-left font-sans">
              
              {/* App Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 px-2 mb-2">
                <span>09:41</span>
                <div className="flex items-center gap-1">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* App Header */}
              <div className="flex items-center justify-between px-2 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Welcome Back</span>
                  <h3 className="text-sm font-bold text-slate-800">Sarah Jenkins</h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center font-bold text-xs text-rose-500 border border-rose-200">
                  SJ
                </div>
              </div>

              {/* Summary Stats Inside App */}
              <div className="grid grid-cols-2 gap-2 px-1 mb-4">
                <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 p-2.5 rounded-xl border border-rose-200/50">
                  <span className="text-[9px] font-semibold text-rose-600 block">Today's Adherence</span>
                  <span className="text-sm font-extrabold text-rose-700">80% Done</span>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-2.5 rounded-xl border border-purple-200/50">
                  <span className="text-[9px] font-semibold text-purple-600 block">Next Reminder</span>
                  <span className="text-sm font-extrabold text-purple-700">12:30 PM</span>
                </div>
              </div>

              {/* Reminders List */}
              <div className="flex-1 flex flex-col gap-2 overflow-hidden px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Doses</span>
                  <span className="text-[9px] font-bold text-rose-500">View All</span>
                </div>

                {/* Reminder Item 1 */}
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-rose-200 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">💊</span>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 leading-tight">Aspirin 81mg</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">Morning dose • With food</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">08:00 AM</span>
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">✓ Taken</span>
                  </div>
                </div>

                {/* Reminder Item 2 */}
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between border-rose-200 animate-float-pulse">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🧴</span>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 leading-tight">Multivitamin</h4>
                      <span className="text-[9px] text-rose-500 font-bold">Alert: Due in 10 mins</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">12:30 PM</span>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">⏰ Pending</span>
                  </div>
                </div>

                {/* Reminder Item 3 */}
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">💉</span>
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-700 leading-tight">Amoxicillin</h4>
                      <span className="text-[9px] text-slate-400 font-semibold">Evening Dose • Antibiotic</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">06:00 PM</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Interactive Dashboard Launcher */}
              <div className="mt-2 mb-1 pt-1">
                <Link href="/login" className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-1 hover:brightness-105 transition-all">
                  Launch Demo Application ➔
                </Link>
              </div>

              {/* Bottom Phone Bar */}
              <div className="w-full flex justify-center pt-2">
                <div className="w-24 h-1 bg-slate-300 rounded-full" />
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER TRUST STRIP ── */}
      <footer className="relative z-20 pb-8 pt-4 px-6 text-center text-xs font-semibold text-slate-500 tracking-wider pointer-events-auto">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 border-t border-rose-200/20 pt-6">
          <span className="flex items-center gap-1">🔒 End-to-End Encryption</span>
          <span className="flex items-center gap-1">🛡️ HIPAA Compliance Standards</span>
          <span className="flex items-center gap-1">⚡ 99.9% Adherence Rates</span>
        </div>
        <p className="mt-4 text-[10px] text-slate-400/80">© {new Date().getFullYear()} Mediguardian. Built for high performance & security.</p>
      </footer>

    </div>
  );
}
