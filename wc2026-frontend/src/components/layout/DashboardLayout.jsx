import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, Target } from "lucide-react";

export default function DashboardLayout() {
  const navItems = [
    {
      name: "Resumen",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      name: "Mis Grupos",
      path: "/groups",
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      name: "Calendario",
      path: "/matches",
      icon: <CalendarDays className="w-5 h-5 shrink-0" />,
    },
    {
      name: "Pronósticos",
      path: "/predictions",
      icon: <Target className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 min-h-screen bg-background">
      {/* Sidebar de Navegación */}
      <aside className="w-full md:w-64 shrink-0">
        <nav
          className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar"
          aria-label="Navegación principal"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 min-h-[44px] rounded-md font-medium transition-all duration-200 ease-out whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent hover:border-border"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
