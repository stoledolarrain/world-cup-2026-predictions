import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/layout/Header";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches"; // El componente real importado
import Groups from "./pages/Groups"; // El componente real importado
import GroupDetail from "./pages/GroupDetail"; // El componente real importado

// Mantenemos solo los placeholders de las vistas que aún no hemos construido
const GroupsPlaceholder = () => <div className="p-6">Vista de Grupos</div>;
const PredictionsPlaceholder = () => (
  <div className="p-6">Vista de Pronósticos</div>
);

const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
    <h1 className="text-4xl font-bold text-surface-dark mb-2">404</h1>
    <p className="text-surface-dark/70 mb-6">La página que buscas no existe.</p>
    <a href="/" className="text-primary font-medium hover:underline">
      Volver al inicio
    </a>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-surface-muted">
          <Header />

          <main className="flex-grow">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas Privadas: Envueltas en el ProtectedRoute y el DashboardLayout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/groups/:groupId" element={<GroupDetail />} />
                  {/* CORRECCIÓN: Renderizamos el componente real <Matches /> */}
                  <Route path="/matches" element={<Matches />} />
                  <Route
                    path="/predictions"
                    element={<PredictionsPlaceholder />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
