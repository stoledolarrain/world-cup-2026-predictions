import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Trophy, Calendar, Users, Target } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-surface-dark text-surface py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            El Mundial 2026 <br className="hidden md:block" />
            <span className="text-primary">en tus manos.</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-muted/80 max-w-2xl mx-auto">
            Crea grupos privados con tus amigos, registra tus pronósticos de
            cada partido y demuestra quién es el verdadero experto en fútbol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-primary text-surface font-semibold px-8 py-3 rounded-md hover:bg-primary-hover transition-colors min-h-[44px] flex items-center justify-center text-lg"
            >
              {isAuthenticated ? "Ir a mi Dashboard" : "Comenzar a jugar"}
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-surface/10 text-surface font-medium px-8 py-3 rounded-md hover:bg-surface/20 transition-colors border border-surface/20 min-h-[44px] flex items-center justify-center text-lg"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface-muted">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-8 h-8 text-primary" />}
            title="Grupos Privados"
            description="Crea o únete a grupos con un código de invitación. Compite directamente contra tus amigos o compañeros de trabajo."
          />
          <FeatureCard
            icon={<Target className="w-8 h-8 text-primary" />}
            title="Pronósticos Precisos"
            description="Acierta el resultado exacto para ganar 3 puntos, o solo el ganador para llevarte 1 punto. Cada detalle cuenta."
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8 text-primary" />}
            title="Ranking en Vivo"
            description="Clasificación actualizada en tiempo real (cada 20 min). Observa cómo subes a la cima de la tabla de posiciones."
          />
        </div>
      </section>
    </div>
  );
}

// Sub-componente para mantener limpio el código
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-surface p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
      <div className="bg-surface-muted w-14 h-14 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-surface-dark mb-2">{title}</h3>
      <p className="text-surface-dark/70 leading-relaxed">{description}</p>
    </div>
  );
}
