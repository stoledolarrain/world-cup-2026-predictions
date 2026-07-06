import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, MapPin } from 'lucide-react';
import { getDashboardSummaryService } from '../services/auth.service';
import StadiumMap from '../components/ui/StadiumMap';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummaryService();
        if (isMounted) setSummary(response.data);
      } catch {
        // Ignoramos el error silenciosamente
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando tu panel...</div>;
  if (!summary) return <div className="p-8 text-center text-red-500">Error al cargar la información.</div>;

  return (
    <div className="max-w-6xl p-6 mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mi Panel General</h1>
        <p className="mt-2 text-gray-600">Resumen de tu participación en la quiniela del Mundial 2026.</p>
      </div>

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full"><Trophy size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Puntaje Total Acumulado</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalPoints || 0} pts</p>
          </div>
        </div>
        
        <div className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 mr-4 text-green-600 bg-green-100 rounded-full"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Grupos Activos</p>
            <p className="text-2xl font-bold text-gray-800">{summary.totalGroups || 0}</p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-3 mr-4 text-purple-600 bg-purple-100 rounded-full"><Calendar size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Próximos Partidos</p>
            <p className="text-2xl font-bold text-gray-800">{summary.upcomingMatches?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Lista de Próximos Partidos */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Próximos Encuentros</h2>
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            {summary.upcomingMatches?.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No hay partidos próximos.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {summary.upcomingMatches?.map(match => (
                  <li key={match.id} className="p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-blue-600 uppercase">{match.stage}</span>
                      <span className="text-xs text-gray-500">{new Date(match.matchDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1" /> {match.city}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-4 text-center border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <Link to="/matches" className="text-sm font-medium text-blue-600 hover:underline">Ver calendario completo</Link>
            </div>
          </div>
        </div>

        {/* Mapa de Sedes Oficiales */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Sedes del Mundial 2026</h2>
          <StadiumMap />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;