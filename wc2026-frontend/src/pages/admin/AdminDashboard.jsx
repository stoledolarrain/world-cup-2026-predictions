import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de Gestión de Partidos */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Gestión de Partidos</h2>
          <p className="mb-4 text-sm text-gray-600">
            Registra nuevos partidos, asigna sedes y configura el ID de TheSportsDB para la actualización automática.
          </p>
          <Link
            to="/admin/matches"
            className="inline-block px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Administrar Partidos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;