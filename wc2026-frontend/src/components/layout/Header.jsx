import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Trophy, LogOut, User } from "lucide-react";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Marca */}
        <Link
          to="/"
          className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
        >
          <Trophy className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-surface-dark">
            Quiniela<span className="text-primary">2026</span>
          </span>
        </Link>

        {/* Navegación Derecha */}
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-surface-dark font-medium hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-surface-dark hover:text-error transition-colors min-h-[44px] px-2"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-surface-dark font-medium hover:text-primary transition-colors min-h-[44px] flex items-center px-2"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-primary text-surface font-medium px-4 py-2 rounded-md hover:bg-primary-hover transition-colors min-h-[44px] flex items-center"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
