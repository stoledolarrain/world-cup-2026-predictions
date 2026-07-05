import { useState, useEffect } from "react";
import api from "../services/api";
import { CalendarDays, MapPin, Clock } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtro simple para la UI (todos, pendientes, finalizados)
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/matches");

        // Log para que veas en tu consola (F12) qué está devolviendo realmente tu backend
        console.log("Respuesta cruda del backend:", response.data);

        // Lógica defensiva para extraer el array de partidos sin importar la estructura
        let matchesArray = [];
        if (Array.isArray(response.data)) {
          matchesArray = response.data;
        } else if (response.data && Array.isArray(response.data.matches)) {
          matchesArray = response.data.matches;
        } else if (response.data && Array.isArray(response.data.data)) {
          matchesArray = response.data.data;
        }

        setMatches(matchesArray);
      } catch (err) {
        setError(
          "Error al cargar el calendario de partidos. Intenta de nuevo.",
        );
        console.error("Error en la petición:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Validación defensiva: Solo filtramos si 'matches' es realmente un array
  const filteredMatches = Array.isArray(matches)
    ? matches.filter((match) => {
        if (filter === "pending") return match.status !== "FINISHED";
        if (filter === "finished") return match.status === "FINISHED";
        return true;
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-dark tracking-tight flex items-center gap-2">
          <CalendarDays className="w-8 h-8 text-primary" />
          Calendario del Mundial
        </h1>

        {/* Botones de Filtro */}
        <div className="flex bg-surface border border-border rounded-lg p-1">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todos
          </FilterButton>
          <FilterButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Pendientes
          </FilterButton>
          <FilterButton
            active={filter === "finished"}
            onClick={() => setFilter("finished")}
          >
            Finalizados
          </FilterButton>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg border border-error/20">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <p className="text-surface-dark/60 text-lg">
            No hay partidos para mostrar en este filtro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id || match._id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-componentes para mantener el código limpio

function FilterButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors min-h-[44px] ${
        active
          ? "bg-primary text-surface shadow-sm"
          : "text-surface-dark hover:bg-surface-muted"
      }`}
    >
      {children}
    </button>
  );
}

function MatchCard({ match }) {
  // Ajusta estas propiedades según lo que devuelva exactamente tu backend
  const homeTeam = match.homeTeam || "Equipo Local";
  const awayTeam = match.awayTeam || "Equipo Visitante";
  const homeScore = match.homeScore !== null ? match.homeScore : "-";
  const awayScore = match.awayScore !== null ? match.awayScore : "-";
  const date = match.date
    ? new Date(match.date).toLocaleDateString()
    : "Por definir";
  const time = match.date
    ? new Date(match.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const isFinished = match.status === "FINISHED";

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Cabecera del partido (Fecha y Sede) */}
      <div className="bg-surface-muted px-4 py-3 border-b border-border flex justify-between items-center text-xs text-surface-dark/70 font-medium">
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </div>

      {/* Marcador Principal */}
      <div className="p-6 flex-grow flex flex-col justify-center gap-6">
        {/* Equipo Local */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-surface-dark">
            {homeTeam}
          </span>
          <span className="text-2xl font-black text-surface-dark bg-surface-muted px-4 py-2 rounded-lg">
            {homeScore}
          </span>
        </div>

        {/* Equipo Visitante */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-surface-dark">
            {awayTeam}
          </span>
          <span className="text-2xl font-black text-surface-dark bg-surface-muted px-4 py-2 rounded-lg">
            {awayScore}
          </span>
        </div>
      </div>

      {/* Pie de la tarjeta (Estado) */}
      <div className="px-4 py-3 bg-surface border-t border-border flex justify-between items-center">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            isFinished
              ? "bg-surface-dark text-surface"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isFinished ? "FINALIZADO" : "PENDIENTE"}
        </span>

        {/* Si no ha terminado, mostramos botón para ir a pronosticar */}
        {!isFinished && (
          <button className="text-primary hover:text-primary-hover text-sm font-medium transition-colors">
            Hacer pronóstico →
          </button>
        )}
      </div>
    </div>
  );
}
