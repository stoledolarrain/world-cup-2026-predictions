import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { loginService } from "../services/auth.service";

// Reglas de validación del formulario con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Formato de correo inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginService(data.email, data.password);
      // response.user y response.token deben existir
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error en Login:", error);
      setApiError("Credenciales incorrectas o error de servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 bg-surface border border-border rounded-xl shadow-sm">
        <h2 className="mb-6 text-3xl font-bold text-center text-foreground tracking-tight">
          Quiniela Mundial 2026
        </h2>

        {/* Alerta de Error Accesible */}
        {apiError && (
          <div
            role="alert"
            aria-live="polite"
            className="p-4 mb-6 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
          >
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              aria-invalid={!!errors.email}
              className={`w-full p-2.5 bg-background text-foreground border rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent ${
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-input hover:border-border"
              }`}
              placeholder="admin@quiniela.com"
            />
            {errors.email && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={!!errors.password}
              className={`w-full p-2.5 bg-background text-foreground border rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent ${
                errors.password
                  ? "border-destructive focus-visible:ring-destructive"
                  : "border-input hover:border-border"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p role="alert" className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[44px] mt-2 text-primary-foreground bg-primary rounded-md font-medium transition-all duration-200 ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
