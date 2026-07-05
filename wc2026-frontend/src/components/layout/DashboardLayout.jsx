import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, Target } from "lucide-react";

export default function DashboardLayout() {
  const navItems = [
    {
      name: "Resumen",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Mis Grupos",
      path: "/groups",
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: "Calendario",
      path: "/matches",
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      name: "Pronósticos",
      path: "/predictions",
      icon: <Target className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar de Navegación */}
      <aside className="w-full md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 min-h-[44px] rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-surface"
                    : "text-surface-dark hover:bg-surface border border-transparent hover:border-border"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal (Aquí se renderizarán las vistas) */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
