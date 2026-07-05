import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Ajusta el endpoint según tu backend (en auth.routes.ts es /login)
      const response = await api.post("/auth/login", { email, password });
      // Asumiendo que el backend devuelve { token: "..." }
      login(response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al iniciar sesión. Revisa tus credenciales.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-sm border border-border">
        <div className="flex justify-center mb-6">
          <div className="bg-surface-muted p-3 rounded-full">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-surface-dark mb-6">
          Iniciar Sesión
        </h1>

        {error && (
          <div
            className="bg-error/10 border border-error text-error text-sm p-3 rounded-md mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-dark mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              className="w-full min-h-[44px] px-4 py-2 rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-dark mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full min-h-[44px] px-4 py-2 rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[44px] bg-primary text-surface font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? "Iniciando..." : "Entrar a mi cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-dark/70">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
