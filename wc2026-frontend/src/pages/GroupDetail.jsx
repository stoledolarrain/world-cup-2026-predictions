import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useGroupDetail from "../hooks/useGroupDetail";
import { Trophy, ArrowLeft, Users, Copy, CheckCircle2 } from "lucide-react";

export default function GroupDetail() {
  const { groupId } = useParams();
<<<<<<< HEAD
  const {
    leaderboard = [],
    inviteCode = "",
    isLoading,
    error,
    fetchGroupDetails,
  } = useGroupDetail(groupId);
=======
  const { leaderboard, inviteCode, isLoading, error, fetchGroupDetails } =
    useGroupDetail(groupId);
>>>>>>> origin/main
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, fetchGroupDetails]);

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/groups"
        className="inline-flex items-center gap-2 text-surface-dark/60 hover:text-primary transition-colors font-medium min-h-[44px]"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Mis Grupos
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-surface p-6 rounded-2xl border border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-dark tracking-tight flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            Clasificación del Grupo
          </h1>
          <p className="text-surface-dark/60 mt-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> {leaderboard?.length || 0}{" "}
            Participantes
          </p>
        </div>

        {inviteCode && (
          <div className="bg-surface-muted p-4 rounded-xl border border-border flex items-center gap-4 w-full md:w-auto">
            <div>
              <p className="text-xs font-bold text-surface-dark/50 uppercase tracking-wider mb-1">
                Código de Invitación
              </p>
              <p className="text-xl font-mono font-black tracking-widest text-surface-dark">
                {inviteCode}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className={`p-3 rounded-lg transition-colors flex items-center justify-center min-h-[44px] min-w-[44px] ${
                copied
                  ? "bg-primary/20 text-primary"
                  : "bg-surface border border-border hover:border-primary text-surface-dark"
              }`}
              title="Copiar código"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-error/10 text-error p-4 rounded-lg border border-error/20">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

<<<<<<< HEAD
      {/* Tabla de Posiciones */}
      {!isLoading &&
        !error &&
        Array.isArray(leaderboard) &&
        leaderboard.length > 0 && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-muted border-b border-border text-surface-dark/70 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold w-24 text-center">Pos</th>
                    <th className="p-4 font-semibold">Jugador</th>
                    <th className="p-4 font-semibold text-right">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaderboard.map((user, index) => {
                    const position = index + 1;
                    const isTop3 = position <= 3;
=======
      {!isLoading && !error && leaderboard.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted border-b border-border text-surface-dark/70 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold w-24 text-center">Pos</th>
                  <th className="p-4 font-semibold">Jugador</th>
                  <th className="p-4 font-semibold text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((user, index) => {
                  const position = index + 1;
                  const isTop3 = position <= 3;
>>>>>>> origin/main

                    return (
                      <tr
                        key={user?.userId || user?.id || index}
                        className="hover:bg-surface-muted/50 transition-colors"
                      >
                        <td className="p-4 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                              position === 1
                                ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-400 shadow-sm"
                                : position === 2
                                  ? "bg-gray-100 text-gray-700 border-2 border-gray-300"
                                  : position === 3
                                    ? "bg-orange-100 text-orange-800 border-2 border-orange-300"
                                    : "text-surface-dark/60 font-medium"
                            }`}
                          >
                            {position}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-surface-dark">
                            {user?.name || user?.userName || "Usuario"}
                          </div>
                          {isTop3 && (
                            <div className="text-xs text-primary font-medium mt-0.5">
                              En zona de premio
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className="inline-block bg-surface-muted px-3 py-1 rounded-md font-black text-lg text-surface-dark border border-border">
                            {user?.points || user?.score || 0} pts
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Empty State */}
      {!isLoading &&
        !error &&
        (!Array.isArray(leaderboard) || leaderboard.length === 0) && (
          <div className="text-center py-20 bg-surface rounded-xl border border-border">
            <p className="text-surface-dark/60">
              No hay participantes en este grupo aún.
            </p>
          </div>
        )}
    </div>
  );
}