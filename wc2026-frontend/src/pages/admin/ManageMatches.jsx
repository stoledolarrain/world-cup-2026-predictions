import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getMatchesService, createMatchService, updateMatchService } from '../../services/matches.service';

const matchSchema = z.object({
  stage: z.string().min(1, 'La fase es obligatoria'),
  matchDate: z.string().min(1, 'La fecha y hora son obligatorias'),
  stadium: z.string().min(1, 'El estadio es obligatorio'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  externalApiId: z.string().optional(),
});

const ManageMatches = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(matchSchema)
  });

  const fetchMatches = async () => {
    try {
      const data = await getMatchesService();
      setMatches(data.data || []);
    } catch (error) {
      console.error(error);
      setError('Error al cargar los partidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initFetch = async () => {
      try {
        const data = await getMatchesService();
        if (isMounted) setMatches(data.data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) setError('Error al cargar los partidos');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initFetch();

    return () => {
      isMounted = false; // Evita fugas de memoria si el usuario cambia de pantalla rápido
    };
  }, []);

  const openModal = (match = null) => {
    setCurrentMatch(match);
    if (match) {
      // Formatear la fecha para el input type="datetime-local"
      const dateForInput = new Date(match.matchDate).toISOString().slice(0, 16);
      reset({
        stage: match.stage,
        matchDate: dateForInput,
        stadium: match.stadium,
        city: match.city,
        externalApiId: match.externalApiId || ''
      });
    } else {
      reset({ stage: '', matchDate: '', stadium: '', city: '', externalApiId: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentMatch(null);
    setError('');
  };

  const onSubmit = async (data) => {
    try {
      if (currentMatch) {
        await updateMatchService(currentMatch.id, data);
      } else {
        await createMatchService(data);
      }
      fetchMatches();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el partido');
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Partidos</h1>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
        >
          + Nuevo Partido
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando partidos...</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Fase</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Sede</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">API ID</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800 capitalize">{match.stage}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(match.matchDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {match.stadium}, {match.city}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === 'FINISHED' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'IN_PLAY' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{match.externalApiId || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openModal(match)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal del Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              {currentMatch ? 'Editar Partido' : 'Registrar Nuevo Partido'}
            </h2>

            {error && (
              <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Fase (ej. Grupos, Octavos)</label>
                <input
                  type="text"
                  {...register('stage')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.stage && <p className="mt-1 text-xs text-red-500">{errors.stage.message}</p>}
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Fecha y Hora</label>
                <input
                  type="datetime-local"
                  {...register('matchDate')}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.matchDate && <p className="mt-1 text-xs text-red-500">{errors.matchDate.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Estadio</label>
                  <input
                    type="text"
                    {...register('stadium')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.stadium && <p className="mt-1 text-xs text-red-500">{errors.stadium.message}</p>}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Ciudad</label>
                  <input
                    type="text"
                    {...register('city')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">ID de TheSportsDB (Opcional)</label>
                <input
                  type="text"
                  {...register('externalApiId')}
                  placeholder="Ej: 1045"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Necesario para la sincronización automática de resultados.
                </p>
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Partido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMatches;