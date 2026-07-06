import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getProfileService, updateProfileService } from '../services/auth.service';

const profileSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  password: z.string().optional().refine(val => !val || val.length >= 6, {
    message: 'Si deseas cambiarla, debe tener al menos 6 caracteres'
  })
});

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const data = await getProfileService();
        if (isMounted) {
          reset({ name: data.data.name, password: '' });
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setMessage({ text: 'Error al cargar el perfil', type: 'error' });
          setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [reset]);

  const onSubmit = async (data) => {
    setMessage({ text: '', type: '' });
    
    // Solo enviamos el password si el usuario escribió algo
    const updateData = { name: data.name };
    if (data.password) updateData.password = data.password;

    try {
      await updateProfileService(updateData);
      setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
      reset({ name: data.name, password: '' }); // Limpiamos el campo de password
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Error al actualizar', type: 'error' });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;

  return (
    <div className="max-w-2xl p-6 mx-auto mt-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Mi Perfil</h1>

      {message.text && (
        <div className={`p-3 mb-6 text-sm rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            {...register('name')}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nueva Contraseña (Opcional)</label>
          <input
            type="password"
            {...register('password')}
            placeholder="Déjalo en blanco para mantener la actual"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;