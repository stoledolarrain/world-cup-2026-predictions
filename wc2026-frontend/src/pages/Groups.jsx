import { useState, useEffect } from "react";
import { Users, Plus, Key, ArrowRight, X } from "lucide-react";
import useGroups from "../hooks/useGroups"; // Importamos nuestro Hook

export default function Groups() {
  // 1. Consumimos la lógica de negocio desde el Hook
  const {
    groups,
    isLoading,
    error,
    actionLoading,
    fetchGroups,
    createGroup,
    joinGroup,
  } = useGroups();

  // 2. Estados EXCLUSIVOS para la Interfaz de Usuario (UI)
  const [modalType, setModalType] = useState(null); // 'create', 'join', o null
  const [inputValue, setInputValue] = useState("");
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const closeModal = () => {
    setModalType(null);
    setInputValue("");
    setActionError(null);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setActionError(null);

    // Delegamos la acción al Hook dependiendo de la modal abierta
    let result;
    if (modalType === "create") {
      result = await createGroup(inputValue);
    } else if (modalType === "join") {
      result = await joinGroup(inputValue);
    }

    // Evaluamos la respuesta del Hook
    if (result?.success) {
      closeModal();
    } else {
      setActionError(result?.message || "Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabecera y Acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-dark tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          Mis Grupos
        </h1>

        <div className="flex w-full sm:w-auto gap-3">
          <button
            onClick={() => setModalType("join")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface text-surface-dark border border-border rounded-lg hover:border-primary transition-colors min-h-[44px] font-medium"
          >
            <Key className="w-4 h-4" />
            Unirse
          </button>
          <button
            onClick={() => setModalType("create")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-surface rounded-lg hover:bg-primary-hover transition-colors min-h-[44px] font-medium"
          >
            <Plus className="w-4 h-4" />
            Crear Grupo
          </button>
        </div>
      </div>

      {/* Estado Principal: Listado de Grupos */}
      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg border border-error/20">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-xl border border-border">
          <Users className="w-12 h-12 text-surface-dark/20 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-surface-dark">
            Aún no tienes grupos
          </h3>
          <p className="text-surface-dark/60 mt-1 max-w-sm mx-auto">
            Crea tu propio grupo para invitar a tus amigos, o únete a uno
            existente usando un código de invitación.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard key={group.id || group._id} group={group} />
          ))}
        </div>
      )}

      {/* Modal de Creación / Unión */}
      {modalType && (
        <div className="fixed inset-0 bg-surface-dark/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-surface w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-surface-dark">
                {modalType === "create"
                  ? "Crear Nuevo Grupo"
                  : "Unirse a un Grupo"}
              </h2>
              <button
                onClick={closeModal}
                className="text-surface-dark/50 hover:text-surface-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="p-6 space-y-4">
              {actionError && (
                <div className="bg-error/10 text-error p-3 rounded-md text-sm border border-error/20">
                  {actionError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-dark mb-1">
                  {modalType === "create"
                    ? "Nombre del Grupo"
                    : "Código de Invitación"}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full min-h-[44px] px-4 py-2 rounded-md border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  placeholder={
                    modalType === "create"
                      ? "Ej. Quiniela Oficina"
                      : "Ingresa el código alfanumérico"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={actionLoading || !inputValue.trim()}
                  className="w-full min-h-[44px] bg-primary text-surface font-semibold rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {actionLoading
                    ? "Procesando..."
                    : modalType === "create"
                      ? "Crear Grupo"
                      : "Unirse ahora"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-componente de Tarjeta
function GroupCard({ group }) {
  const groupName = group.name || "Grupo sin nombre";
  const membersCount = group.members?.length || group.membersCount || 1;
  const userRank = group.userRank || "-";
  const groupCode = group.inviteCode || group.code || null; // Soporte para ambos nombres de propiedad

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col">
      <div className="p-6 flex-grow">
        <h3
          className="text-xl font-bold text-surface-dark mb-4 pr-8 line-clamp-1"
          title={groupName}
        >
          {groupName}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-surface-dark/60 font-medium uppercase tracking-wider mb-1">
              Participantes
            </p>
            <p className="text-lg font-bold text-surface-dark flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" /> {membersCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-dark/60 font-medium uppercase tracking-wider mb-1">
              Tu Posición
            </p>
            <p className="text-lg font-bold text-surface-dark flex items-center gap-1">
              # {userRank}
            </p>
          </div>
        </div>

        {groupCode && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-surface-dark/60 font-medium mb-1">
              Código de invitación:
            </p>
            <code className="bg-surface-muted px-2 py-1 rounded text-sm text-surface-dark font-mono font-bold select-all">
              {groupCode}
            </code>
          </div>
        )}
      </div>

      <Link
        to={`/groups/${group.id || group._id}`}
        className="w-full p-4 bg-surface-muted text-surface-dark font-medium flex justify-between items-center hover:text-primary transition-colors group-hover:bg-primary/5 min-h-[44px]"
      >
        Ver Clasificación
        <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}
