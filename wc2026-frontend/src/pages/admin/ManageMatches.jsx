import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getMatchesService,
  createMatchService,
} from "../../services/matches.service";

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(matchSchema),
  });

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await getMatchesService();
      // Verificamos que la estructura coincida con el controller (que devuelve { data: matches })
      setMatches(response?.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los partidos del servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const onSubmit = async (data) => {
    try {
      await createMatchService(data);
      reset(); // Limpia el formulario
      fetchMatches(); // Recarga la tabla
    } catch (err) {
      alert("Error al guardar el partido");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Partidos</h1>
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando partidos...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sede
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <tr key={match.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.stage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(match.matchDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.stadium}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {match.status || "SCHEDULED"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No hay partidos registrados. Usa el botón "Nuevo Partido"
                    para agregar uno.
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
