import { useState, useEffect } from 'react';
import api from '../services/api';

const Predictions = () => {
  const [matches, setMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({}); // Para mostrar "Guardado" en cada partido

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Obtenemos solo los partidos que aún no se juegan (SCHEDULED)
        const matchesRes = await api.get('/matches?status=SCHEDULED');
        const predictionsRes = await api.get('/predictions');
        
        if (isMounted) {
          setMatches(matchesRes.data.data || []);
          setMyPredictions(predictionsRes.data.data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error cargando datos", error);
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const handleSavePrediction = async (matchId, homeScore, awayScore) => {
    // Buscar si ya existe un pronóstico para este partido
    const existingPrediction = myPredictions.find(p => p.match.id === matchId);
    
    try {
      if (existingPrediction) {
        // Actualizar
        await api.put(`/predictions/${existingPrediction.id}`, {
          predictedHomeScore: parseInt(homeScore),
          predictedAwayScore: parseInt(awayScore)
        });
      } else {
        // Crear nuevo
        const res = await api.post('/predictions', {
          matchId,
          predictedHomeScore: parseInt(homeScore),
          predictedAwayScore: parseInt(awayScore)
        });
        setMyPredictions([...myPredictions, res.data.data]);
      }
      
      // Mostrar feedback de éxito temporalmente
      setFeedback({ ...feedback, [matchId]: { type: 'success', text: '¡Guardado!' } });
      setTimeout(() => setFeedback(prev => ({ ...prev, [matchId]: null })), 3000);
      
    } catch {
      setFeedback({ ...feedback, [matchId]: { type: 'error', text: 'Error al guardar' } });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Cargando partidos...</div>;

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Mis Pronósticos</h1>
      <p className="mb-8 text-gray-600">Ingresa tus resultados antes de que comiencen los partidos.</p>

      {matches.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg shadow-sm">No hay partidos programados por el momento.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {matches.map((match) => {
            const prediction = myPredictions.find(p => p.match.id === match.id);
            const matchFeedback = feedback[match.id];

            return (
              <PredictionCard 
                key={match.id} 
                match={match} 
                prediction={prediction} 
                feedback={matchFeedback}
                onSave={handleSavePrediction} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Componente Tarjeta del Partido (Interno a Predictions para mantenerlo en un solo archivo)
const PredictionCard = ({ match, prediction, feedback, onSave }) => {
  const [homeScore, setHomeScore] = useState(prediction ? prediction.predictedHomeScore : '');
  const [awayScore, setAwayScore] = useState(prediction ? prediction.predictedAwayScore : '');

  const isButtonDisabled = homeScore === '' || awayScore === '' || homeScore < 0 || awayScore < 0;

  return (
    <div className="p-5 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <span className="font-medium text-blue-600 capitalize">{match.stage}</span>
        <span>{new Date(match.matchDate).toLocaleDateString()}</span>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-center flex-1">
          <span className="font-bold text-gray-800">Local</span>
          <input 
            type="number" 
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            className="w-16 p-2 mt-2 text-xl text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="px-4 font-bold text-gray-400">VS</div>
        <div className="flex flex-col items-center flex-1">
          <span className="font-bold text-gray-800">Visitante</span>
          <input 
            type="number" 
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            className="w-16 p-2 mt-2 text-xl text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`text-sm font-medium ${matchFeedbackColor(feedback?.type)}`}>
          {feedback?.text || (prediction ? 'Pronóstico registrado' : 'Sin pronóstico')}
        </span>
        <button 
          onClick={() => onSave(match.id, homeScore, awayScore)}
          disabled={isButtonDisabled}
          className="px-4 py-2 text-sm text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

const matchFeedbackColor = (type) => {
  if (type === 'success') return 'text-green-600';
  if (type === 'error') return 'text-red-600';
  return 'text-gray-400';
};

export default Predictions;