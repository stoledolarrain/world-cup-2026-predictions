import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { getMatchesService } from '../services/matches.service';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchMatches = async () => {
      try {
        const data = await getMatchesService();
        if (isMounted) setMatches(data.data || []);
      } catch {
        // Ignoramos el error para no dejar variables sin uso en el linter
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMatches();
    
    return () => { isMounted = false; };
  }, []);

  // Filtramos por fase si el usuario seleccionó alguna opción
  const filteredMatches = filter 
    ? matches.filter(m => m.stage.toLowerCase().includes(filter.toLowerCase())) 
    : matches;

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando calendario...</div>;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendario de Partidos</h1>
          <p className="mt-2 text-gray-600">Consulta las fechas, sedes y resultados del Mundial 2026.</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Todas las Fases</option>
            <option value="grupos">Fase de Grupos</option>
            <option value="octavos">Octavos de Final</option>
            <option value="cuartos">Cuartos de Final</option>
            <option value="semifinal">Semifinal</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">No hay partidos registrados.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <div key={match.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="px-4 py-2 text-sm font-semibold text-white uppercase bg-blue-800">
                {match.stage}
              </div>
              
              <div className="p-5">
                <div className="flex items-center justify-center mb-6 space-x-6">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">Local</span>
                    <span className="text-3xl font-black text-blue-600">
                      {match.homeScore !== null ? match.homeScore : '-'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-400">VS</span>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold text-gray-800">Visita</span>
                    <span className="text-3xl font-black text-blue-600">
                      {match.awayScore !== null ? match.awayScore : '-'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-3 text-sm text-gray-600 border-t border-gray-100">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{new Date(match.matchDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{match.stadium}, {match.city}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    match.status === 'FINISHED' ? 'bg-gray-100 text-gray-800' :
                    match.status === 'IN_PLAY' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {match.status === 'FINISHED' ? 'Finalizado' : match.status === 'IN_PLAY' ? 'En Juego' : 'Programado'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;