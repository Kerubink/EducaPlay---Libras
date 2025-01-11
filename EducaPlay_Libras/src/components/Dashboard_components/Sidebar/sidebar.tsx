import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard/create-games" className="hover:text-yellow-400">
              Criar Jogos
            </Link>
          </li>
          <li>
            <Link to="/dashboard/manage-students" className="hover:text-yellow-400">
              Gerenciar Alunos
            </Link>
          </li>
          <li>
            <Link to="/dashboard/analytics" className="hover:text-yellow-400">
              Análises
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
