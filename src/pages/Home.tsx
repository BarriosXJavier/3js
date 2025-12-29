import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-neutral-800 hover:bg-neutral-700 text-yellow-400"
            : "bg-white hover:bg-gray-100 text-gray-800 shadow-lg"
        }`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      {/* Animated SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGradient1" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="lineGradient2" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="6s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="lineGradient3" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="10s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="10s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="lineGradient4" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="7s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="7s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="lineGradient5" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="12s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="12s"
              repeatCount="indefinite"
            />
          </linearGradient>
          <linearGradient id="lineGradient6" gradientUnits="userSpaceOnUse">
            <stop
              offset="0%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={theme === "dark" ? "#ffffff" : "#000000"}
              stopOpacity="0"
            />
            <animate
              attributeName="x1"
              values="0%;0%;100%"
              dur="9s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;100%;100%"
              dur="9s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        <path
          d="M0,100 Q400,50 800,150 T1600,100"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M0,300 Q300,250 600,350 T1200,300"
          fill="none"
          stroke="url(#lineGradient2)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M0,500 Q500,450 1000,550 T2000,500"
          fill="none"
          stroke="url(#lineGradient3)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M1600,200 Q1400,150 1200,250 T800,200"
          fill="none"
          stroke="url(#lineGradient4)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M1400,400 Q1200,350 1000,450 T600,400"
          fill="none"
          stroke="url(#lineGradient5)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M200,600 Q600,550 1000,650 T1800,600"
          fill="none"
          stroke="url(#lineGradient6)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M1800,50 Q1500,20 1200,100 T600,80"
          fill="none"
          stroke="url(#lineGradient1)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M100,700 Q400,680 700,750 T1400,720"
          fill="none"
          stroke="url(#lineGradient3)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
        <path
          d="M1900,350 Q1600,320 1300,380 T700,360"
          fill="none"
          stroke="url(#lineGradient2)"
          strokeWidth="2"
          opacity={theme === "dark" ? "0.3" : "0.2"}
        />
      </svg>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <p
            className={`text-xl ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            A collection of my three.js projects
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Particle Galaxy Card */}
          <Link
            to="/particle-galaxy"
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
              theme === "dark"
                ? "bg-neutral-900 border border-neutral-800 hover:border-neutral-600"
                : "bg-white border border-gray-200 hover:border-gray-400 shadow-lg"
            }`}
          >
            <div className="aspect-video relative overflow-hidden bg-black">
              <img
                src="/particle-galaxy/screenshots/galaxy.png"
                alt="Particle Galaxy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h2
                  className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Particle Galaxy
                </h2>
              </div>
              <p
                className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Procedurally generated galaxy with custom shaders and bloom
                effects
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  BufferGeometry
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Shaders
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Post-processing
                </span>
              </div>
            </div>
          </Link>

          {/* Moonlit Night Card */}
          <Link
            to="/moonlit-night"
            className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
              theme === "dark"
                ? "bg-neutral-900 border border-neutral-800 hover:border-neutral-600"
                : "bg-white border border-gray-200 hover:border-gray-400 shadow-lg"
            }`}
          >
            <div className="aspect-video relative overflow-hidden bg-black">
              <img
                src="/moonlit-night/screenshots/moonlit-night.png"
                alt="Moonlit Night"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-60" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <h2
                  className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Moonlit Night
                </h2>
              </div>
              <p
                className={`mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
              >
                Serene night scene with atmospheric lighting
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  React Three Fiber
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Drei
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Lighting
                </span>
              </div>
            </div>
          </Link>
        </div>

        <footer
          className={`text-center mt-12 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}
        >
          <p>Built with Three.js, React, and Vite</p>
        </footer>
      </div>
    </div>
  );
}
