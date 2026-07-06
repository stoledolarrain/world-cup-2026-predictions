import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Header from './components/layout/Header';

// Importación de las páginas principales
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail'; // ¡Añadido para solucionar el error!
import Predictions from './pages/Predictions';
import Profile from './pages/Profile';

// Importación de las vistas del Administrador
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMatches from './pages/admin/ManageMatches';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container px-4 py-8 mx-auto">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas Protegidas (Solo usuarios logueados) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:groupId" element={<GroupDetail />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Rutas Exclusivas de Administrador */}
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/matches" element={<ManageMatches />} />
              </Route>
              
              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;