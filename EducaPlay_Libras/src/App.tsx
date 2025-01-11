import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Homepage from "../src/pages/homepage/index";
import Dashboard from "../src/pages/dashboard/index";
import CreateGames from "../src/pages/dashboard/pagesDashboard/CreateGames";
import ManageStudents from "../src/pages/dashboard/pagesDashboard/ManageStudents";
import Analytics from "../src/pages/dashboard/pagesDashboard/Analytics";
import GameScreen from "./pages/gameScreen";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/game/:gameName" element={<GameScreen />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="create-games" element={<CreateGames />} />
              <Route path="manage-students" element={<ManageStudents />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 text-center text-sm text-gray-600 py-4">
          © {new Date().getFullYear()} Jogos Educativos. Todos os direitos
          reservados.
        </footer>
      </div>
    </Router>
  );
};

const AddGame = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Adicionar Novo Jogo</h1>
      <p>Formulário de adição de jogos pode ser integrado aqui no futuro.</p>
    </div>
  );
};

export default App;
