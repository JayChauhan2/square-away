import { NavLink } from "react-router-dom";

export default function FloatingNavbar() {
  const linkBase = "px-4 py-2 rounded-full text-sm font-light transition-all duration-300";
  const active = "bg-white/60 text-slate-900 shadow-sm";
  const inactive = "text-slate-600 hover:text-slate-900 hover:bg-white/40";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 px-3 py-2
        bg-white/50 backdrop-blur-xl
        border border-white/40
        rounded-full shadow-lg shadow-blue-500/10"
      >
        <NavLink
          to="/"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Upload
        </NavLink>

        <NavLink
          to="/library"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Library
        </NavLink>

        <NavLink
          to="/practice"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          Practice
        </NavLink>
      </nav>
    </div>
  );
}
