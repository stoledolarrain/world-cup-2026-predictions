import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { loginService } from "../services/auth.service";
import { Trophy, AlertCircle, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato inválido"),
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
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const response = await loginService(data.email, data.password);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (error) {
      setApiError("Las credenciales son incorrectas.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Branding Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
            <Trophy size={32} />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
            Bienvenido de nuevo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tus pronósticos del Mundial 2026
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle size={16} />
                {apiError}
              </div>
            )}

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                {...register("email")}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                placeholder="usuario@ejemplo.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className={`w-full rounded-lg border px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full min-h-[48px] items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-300 active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Regístrate ahora
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
