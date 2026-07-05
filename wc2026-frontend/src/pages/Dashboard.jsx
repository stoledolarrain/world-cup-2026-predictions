import { Trophy, Users, Calendar, Target } from "lucide-react";

export default function Dashboard() {
  // Aquí luego conectaremos con tu API usando useEffect y un estado,
  // por ahora usaremos datos estáticos para armar la UI.
  const stats = {
    groupsCount: 2,
    pendingMatches: 5,
    totalPoints: 12,
    globalRank: 4,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-surface-dark tracking-tight">
        Mi Panel
      </h1>

      {/* Tarjetas de Resumen (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Puntaje Acumulado"
          value={`${stats.totalPoints} pts`}
          icon={<Trophy className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title="Mis Grupos"
          value={stats.groupsCount}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title="Partidos Pendientes"
          value={stats.pendingMatches}
          icon={<Calendar className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title="Pronósticos"
          value="Activos"
          icon={<Target className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* Sección de Próximos Partidos (Placeholder para el futuro) */}
      <div className="bg-surface border border-border rounded-xl p-6 mt-8">
        <h2 className="text-lg font-bold text-surface-dark mb-4">
          Próximos Partidos a Pronosticar
        </h2>
        <div className="text-center py-8 text-surface-dark/60">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Aún no hay partidos cargados en el sistema.</p>
        </div>
      </div>
    </div>
  );
}

// Componente UI reutilizable para mantener limpio el código
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-surface p-5 rounded-xl border border-border shadow-sm flex items-center gap-4">
      <div className="bg-surface-muted p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-medium text-surface-dark/70">{title}</p>
        <p className="text-2xl font-bold text-surface-dark">{value}</p>
      </div>
    </div>
  );
}
