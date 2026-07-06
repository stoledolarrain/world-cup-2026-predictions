import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Asegúrate que esta ruta sea correcta

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Verificando sesión...</div>; // Muestra esto mientras carga
  }

  if (!user) {
    console.warn("🚫 Acceso denegado: Usuario no logueado");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== "ADMIN") {
    console.warn("🚫 Acceso denegado: No es administrador");
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
