import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, MapPin, ChevronRight } from "lucide-react";
import { getDashboardSummaryService } from "../services/auth.service";
import StadiumMap from "../components/ui/StadiumMap";

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
        // Manejo silencioso asumido por el requerimiento
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className="max-w-6xl p-6 mx-auto space-y-8 animate-pulse"
        aria-busy="true"
      >
        <div className="h-10 bg-surface rounded-md w-1/3 mb-2"></div>
        <div className="h-5 bg-surface rounded-md w-1/2"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-surface rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!summary)
    return (
      <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
        No se pudo cargar la información del panel.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Mi Panel General
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Resumen de tu participación en la quiniela del Mundial 2026.
        </p>
      </header>

      {/* Tarjetas de Estadísticas Rápidas con Tokens */}
      <section
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        aria-label="Estadísticas de usuario"
      >
        <div className="flex items-center p-6 bg-surface border border-border rounded-xl shadow-sm transition-shadow hover:shadow-md">
          <div className="p-3 mr-4 text-primary bg-primary/10 rounded-full shrink-0">
            <Trophy size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Puntaje Total Acumulado
            </p>
            <p className="text-2xl font-bold text-foreground">
              {summary.totalPoints || 0}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                pts
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-surface border border-border rounded-xl shadow-sm transition-shadow hover:shadow-md">
          <div className="p-3 mr-4 text-green-500 bg-green-500/10 rounded-full shrink-0">
            <Users size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Grupos Activos
            </p>
            <p className="text-2xl font-bold text-foreground">
              {summary.totalGroups || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-surface border border-border rounded-xl shadow-sm transition-shadow hover:shadow-md">
          <div className="p-3 mr-4 text-accent bg-accent/10 rounded-full shrink-0">
            <Calendar size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Próximos Partidos
            </p>
            <p className="text-2xl font-bold text-foreground">
              {summary.upcomingMatches?.length || 0}
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Lista de Próximos Partidos */}
        <section
          className="lg:col-span-1 space-y-4"
          aria-labelledby="upcoming-matches-title"
        >
          <h2
            id="upcoming-matches-title"
            className="text-xl font-bold text-foreground tracking-tight"
          >
            Próximos Encuentros
          </h2>
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            {summary.upcomingMatches?.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground text-sm">
                No hay partidos próximos.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {summary.upcomingMatches?.map((match) => (
                  <li
                    key={match.id}
                    className="p-4 transition-colors hover:bg-muted/50 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-primary tracking-wider uppercase">
                        {match.stage}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-foreground">
                      <MapPin
                        size={16}
                        className="mr-1.5 text-muted-foreground group-hover:text-primary transition-colors"
                      />
                      {match.city}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="p-4 text-center border-t border-border bg-muted/20 mt-auto">
              <Link
                to="/matches"
                className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                Ver calendario completo{" "}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Mapa de Sedes Oficiales */}
        <section
          className="lg:col-span-2 space-y-4"
          aria-labelledby="map-title"
        >
          <h2
            id="map-title"
            className="text-xl font-bold text-foreground tracking-tight"
          >
            Sedes del Mundial 2026
          </h2>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm ring-1 ring-black/5 dark:ring-white/5">
            <StadiumMap />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
