import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMatchesService } from "../../services/matches.service";

const matchSchema = z.object({
  stage: z.string().min(1, "La fase es obligatoria"),
  matchDate: z.string().min(1, "La fecha y hora son obligatorias"),
  stadium: z.string().min(1, "El estadio es obligatorio"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  externalApiId: z.string().optional(),
});

const ManageMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {} = useForm({
    resolver: zodResolver(matchSchema),
  });

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await getMatchesService();
      setMatches(response?.data || []);
    } catch (err) {
      console.error("Error cargando partidos:", err);
      setError("No se pudieron cargar los partidos del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Partidos del Mundial</h1>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando partidos...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    {/* CELDA DE EQUIPOS CON ESCUDOS */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      <div className="flex items-center justify-center space-x-4 w-full">
                        {/* Equipo Local */}
                        <div className="flex items-center space-x-2 w-32 justify-end">
                          <span>{match.homeTeam}</span>
                          {match.homeTeamBadge ? (
                            <img
                              src={match.homeTeamBadge}
                              alt={match.homeTeam}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                          )}
                        </div>

                        {/* Separador */}
                        <span className="text-gray-400 text-xs font-bold px-2">
                          VS
                        </span>

                        {/* Equipo Visitante */}
                        <div className="flex items-center space-x-2 w-32 justify-start">
                          {match.awayTeamBadge ? (
                            <img
                              src={match.awayTeamBadge}
                              alt={match.awayTeam}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                          )}
                          <span>{match.awayTeam}</span>
                        </div>
                      </div>
                    </td>

                    {/* FASE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.stage}
                    </td>

                    {/* FECHA Y HORA */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(match.matchDate).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* SEDE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.stadiumCity}
                    </td>

                    {/* ESTADO */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          match.status === "FINISHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {match.status || "SCHEDULED"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No hay partidos registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageMatches;
