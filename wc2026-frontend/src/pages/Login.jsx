import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { loginService } from '../services/auth.service';

// Reglas de validación del formulario con Zod
const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

const Login = () => {
  const { login } = useAuth(); // Usamos el hook que ya tienes en tu estructura
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  // Configuración de react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Función de envío al backend
  const onSubmit = async (data) => {
    setApiError(''); 
    try {
      const response = await loginService(data.email, data.password);
      
      // Guardamos la sesión usando la función de tu AuthContext
      login(response.user, response.token);
      
      // Redirigimos al Dashboard
      navigate('/dashboard');
    } catch (error) {
      // Si el backend lanza error (ej. Credenciales inválidas), lo mostramos
      setApiError(
        error.response?.data?.message || 'Ocurrió un error al intentar iniciar sesión'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Quiniela Mundial 2026
        </h2>
        
        {apiError && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="tu@correo.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;