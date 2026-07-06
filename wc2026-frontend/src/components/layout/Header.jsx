import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logoutService } from '../../services/auth.service';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
    } catch {
      // Ignoramos el error silenciosamente si el token ya expiró en el servidor
    } finally {
      logout(); // Limpiamos el context y el localStorage
      navigate('/login');
    }
  };

  // Si no hay usuario logueado, no renderizamos el header
  if (!user) return null;

  return (
    <header className="text-white bg-blue-800 shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-xl font-bold tracking-wider">
              WC2026
            </Link>
            
            <nav className="hidden space-x-2 md:flex">
              <Link to="/dashboard" className="px-3 py-2 transition-colors rounded-md hover:bg-blue-700">Dashboard</Link>
              <Link to="/matches" className="px-3 py-2 transition-colors rounded-md hover:bg-blue-700">Partidos</Link>
              <Link to="/groups" className="px-3 py-2 transition-colors rounded-md hover:bg-blue-700">Grupos</Link>
              <Link to="/predictions" className="px-3 py-2 transition-colors rounded-md hover:bg-blue-700">Pronósticos</Link>
              
              {/* Renderizado condicional: Solo se muestra si es Administrador */}
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="px-3 py-2 font-semibold transition-colors bg-orange-600 rounded-md hover:bg-orange-700">
                  Panel Admin
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-sm transition-colors hover:text-blue-200">
              Hola, {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium transition-colors bg-red-600 rounded-md hover:bg-red-700"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;