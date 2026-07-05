import { useState, useCallback } from "react";
import api from "../services/api";

export default function useGroupDetail(groupId) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;
    setIsLoading(true);
    setError(null);

    try {
      // Hacemos las peticiones previniendo que una falla rompa la otra
      const [leaderboardRes, inviteRes] = await Promise.all([
        api.get(`/groups/${groupId}/leaderboard`).catch((err) => {
          console.error("Error obteniendo leaderboard:", err);
          return { data: [] }; // Fallback seguro
        }),
        api.get(`/groups/${groupId}/invite`).catch((err) => {
          console.error("Error obteniendo código:", err);
          return { data: { code: "" } }; // Fallback seguro
        }),
      ]);

      // Lógica hiper-defensiva para el leaderboard
      let boardData = [];
      if (Array.isArray(leaderboardRes?.data)) {
        boardData = leaderboardRes.data;
      } else if (Array.isArray(leaderboardRes?.data?.leaderboard)) {
        boardData = leaderboardRes.data.leaderboard;
      } else if (Array.isArray(leaderboardRes?.data?.data)) {
        boardData = leaderboardRes.data.data;
      }

      setLeaderboard(boardData);
      setInviteCode(inviteRes?.data?.code || inviteRes?.data?.inviteCode || "");
    } catch (err) {
      setError("Error al cargar la información del grupo.");
      console.error("Error general en el detalle del grupo:", err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  return {
    leaderboard,
    inviteCode,
    isLoading,
    error,
    fetchGroupDetails,
  };
}
