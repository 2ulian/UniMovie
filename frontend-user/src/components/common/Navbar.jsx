import { useState } from "react";
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // Note : useEffect sera vu au TP 03
  // Pour l'instant, version statique
  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300
${isScrolled ? "bg-black" : "bg-gradient-to-b from-black/80 to-transparent"}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <h1 className="text-primary text-3xl font-bold tracking-tight">
              NETFLIX
            </h1>
            {/* Navigation Links */}
            <ul className="hidden md:flex space-x-6">
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Films
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Mes locations
                </a>
              </li>
            </ul>
          </div>
          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="hover:text-gray-300 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {/* User Avatar */}
            <div
              className="w-8 h-8 bg-primary rounded flex items-center
justify-center cursor-pointer hover:bg-primary-dark transition-colors"
            >
              <span className="text-sm font-bold">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
