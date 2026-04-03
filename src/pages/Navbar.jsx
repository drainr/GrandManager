import React, { useState, useEffect } from "react";
import "/src/App.css";
import { useNavigate } from "react-router-dom";
import RedButton from "../components/RedButton";
import PurpleButton from "../components/PurpleButton.jsx";
import { logout } from "../firebase/auth";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../hooks/useAuth.js";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user ? user.displayName || user.name || "User" : "Guest";

  useEffect(() => {
    const handleClickOutside = () => setMenuOpen(false);
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="navbar-container fixed top-0 left-0 w-full p-2 bg-[#4d2c72] shadow-xl flex items-center justify-between z-50">
      <h1 className="navbar-title text-sm shrikhand-regular text-[#EBB537]">
        GrandManager
      </h1>
      <div className="relative mr-4">
        <span className="navbar-username shrikhand-regular text-[#EBB537] p-2">
          {displayName || "Guest"}
        </span>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="btn btn-ghost btn-circle avatar overflow-hidden"
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <CgProfile className="navbar-icon w-full h-full text-[#EBB537]" />
          </div>
        </div>

        {/* Menu only renders when open */}
        {menuOpen && (
          <ul className="absolute right-0 top-full flex flex-col menu menu-sm bg-[#EBB537] text-white rounded-box z-[1] mt-3 p-2 shadow-2xl border border-[#4d2c72]">
            <li>
              <PurpleButton text="Settings" onClick={() => { navigate("/settings"); setMenuOpen(false); }} />
            </li>
            <li>
              <RedButton text="Logout" onClick={() => { handleLogout(); setMenuOpen(false); }} />
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;