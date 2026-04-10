import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItem = (to, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`transition font-semibold ${
          active ? "text-white" : "text-gray-300 hover:text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-500/20 bg-[#02081f]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold text-purple-400">
          SkillMentor
        </Link>

        <nav className="flex items-center gap-8 text-sm sm:text-base">
          {navItem("/", "Home")}
          {navItem("/learn", "Learn")}
          {navItem("/practice", "Practice")}
          {navItem("/video-summary", "Video Summary")}
        </nav>
      </div>
    </header>
  );
}