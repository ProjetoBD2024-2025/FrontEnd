import React, { useState } from "react";
import { Menu, X, BrickWall, CircleUser, List } from "lucide-react"; // Ícones para o menu
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Navbar superior */}
      <header className="text-white p-4 flex justify-between items-center shadow-md" style={{ backgroundColor: "#003c64" }}>
        <div onClick={() => setIsSidebarOpen(true)} className="text-white">
          <Menu className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-semibold">Gerenciador de Projetos</h1>
      </header>

      {/* Overlay com opacidade ao abrir o menu */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Menu lateral recolhível */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform z-50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links do menu */}
        <nav className="p-4 space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
          >
            <BrickWall className="w-5 h-5" />
            <span>Projetos</span>
          </Link>
          <Link
            to="/contratantes"
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition"
          >
            <CircleUser className="w-5 h-5" />
            <span>Contratantes</span>
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
