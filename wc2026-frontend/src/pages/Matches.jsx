import { useState, useEffect } from "react";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { getMatchesService } from "../services/matches.service";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

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

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtramos por fase si el usuario seleccionó alguna opción
  const filteredMatches = filter
    ? matches.filter((m) =>
        m.stage.toLowerCase().includes(filter.toLowerCase()),
      )
    : matches;

  if (loading)
    return (
      <div className="p-10 text-xl font-semibold text-center text-gray-500">
        Cargando calendario del Mundial...
      </div>
    );

  return (
    <div className="max-w-7xl p-6 mx-auto">
      {/* Cabecera y Filtro */}
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Calendario de Partidos
        </h1>
        <select
          className="px-4 py-2 mt-4 bg-white border border-gray-300 rounded-lg shadow-sm md:mt-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Todas las Fases</option>
          <option value="Group Stage">Fase de Grupos</option>
          <option value="Round of 32">Dieciseisavos de Final</option>
          <option value="Round of 16">Octavos de Final</option>
          <option value="Quarter-Final">Cuartos de Final</option>
          <option value="Semi-Final">Semifinales</option>
          <option value="Final">Final</option>
        </select>
      </div>

      {/* Grilla de Partidos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className="p-6 transition-shadow bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl"
            >
              {/* Etiqueta de Fase y Estado */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {match.stage}
                </span>
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    match.status === "FINISHED"
                      ? "bg-gray-100 text-gray-700 border border-gray-200"
                      : match.status === "IN_PLAY"
                        ? "bg-green-100 text-green-800 animate-pulse border border-green-200"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                  }`}
                >
                  {match.status === "FINISHED"
                    ? "Finalizado"
                    : match.status === "IN_PLAY"
                      ? "En Juego"
                      : "Programado"}
                </span>
              </div>

              {/* Equipos, Escudos y Marcador */}
              <div className="flex items-center justify-between mb-6">
                {/* Equipo Local */}
                <div className="flex flex-col items-center w-[35%] text-center">
                  {match.homeTeamBadge ? (
                    <img
                      src={match.homeTeamBadge}
                      alt={match.homeTeam}
                      className="w-16 h-16 object-contain mb-3 drop-shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 mb-3 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                  )}
                  <span className="font-bold text-sm text-gray-800 leading-tight">
                    {match.homeTeam}
                  </span>
                </div>

                {/* Marcador o VS */}
                <div className="flex flex-col items-center justify-center w-[30%]">
                  {match.status === "SCHEDULED" ? (
                    <span className="text-2xl font-black text-gray-300">
                      VS
                    </span>
                  ) : (
                    <div className="flex items-center space-x-2 text-4xl font-black text-gray-800">
                      <span>{match.homeScore}</span>
                      <span className="text-gray-300 text-2xl mb-1">-</span>
                      <span>{match.awayScore}</span>
                    </div>
                  )}
                </div>

                {/* Equipo Visitante */}
                <div className="flex flex-col items-center w-[35%] text-center">
                  {match.awayTeamBadge ? (
                    <img
                      src={match.awayTeamBadge}
                      alt={match.awayTeam}
                      className="w-16 h-16 object-contain mb-3 drop-shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 mb-3 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                  )}
                  <span className="font-bold text-sm text-gray-800 leading-tight">
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              {/* Detalles Inferiores (Fecha, Hora, Sede) */}
              <div className="pt-4 space-y-3 text-sm text-gray-600 border-t border-gray-100">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">
                    {new Date(match.matchDate).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-medium">
                    {new Date(match.matchDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-blue-500 shrink-0" />
                  <span
                    className="truncate font-medium"
                    title={match.stadiumCity}
                  >
                    {match.stadiumCity}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-xl text-gray-500">
              No se encontraron partidos para la fase seleccionada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
