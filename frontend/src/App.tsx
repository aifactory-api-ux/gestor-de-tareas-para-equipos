import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MisTareasPage from './pages/MisTareasPage';
import TareasVencidasPage from './pages/TareasVencidasPage';
import CreateTaskPage from './pages/CreateTaskPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/mis-tareas" element={<MisTareasPage />} />
      <Route path="/vencidas" element={<TareasVencidasPage />} />
      <Route path="/crear-tarea" element={<CreateTaskPage />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
