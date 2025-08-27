"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../components/ui/resizable-navbar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Brain } from "lucide-react";

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/", icon: Home },
    { name: "Try Exam", link: "/exam", icon: FileText },
    { name: "Try Big Exam", link: "/big-exam", icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative w-full">
    <Navbar className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop */}
      <NavBody>
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.7)] transition-all">
            Axion
          </h1>
        </div>

        <div className="flex gap-6 font-medium text-gray-300">
          {navItems.map(({ name, link, icon: Icon }) => (
            <div
              key={link}
              onClick={() => navigate(link)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                isActive(link)
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "hover:bg-gray-700/50 hover:text-cyan-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Axion
            </h1>
          </div>

          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="z-50"
        >
          {navItems.map(({ name, link }, idx) => (
            <div
              key={`mobile-link-${idx}`}
              onClick={() => {
                navigate(link);
                setIsMobileMenuOpen(false);
              }}
              className={`relative text-neutral-600 dark:text-neutral-300 px-3 py-2 rounded-lg ${
                isActive(link) ? "bg-purple-500/20 text-purple-300" : ""
              }`}
            >
              {name}
            </div>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
    </div>
  );
}
