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
      // Hacemos las peticiones en paralelo para que cargue más rápido
      const [leaderboardRes, inviteRes] = await Promise.all([
        api.get(`/groups/${groupId}/leaderboard`),
        api
          .get(`/groups/${groupId}/invite`)
          .catch(() => ({ data: { code: "" } })), // Prevenimos fallos si no hay código
      ]);

      // Adaptación defensiva para el leaderboard
      let boardData = [];
      if (Array.isArray(leaderboardRes.data)) boardData = leaderboardRes.data;
      else if (leaderboardRes.data?.leaderboard)
        boardData = leaderboardRes.data.leaderboard;
      else if (leaderboardRes.data?.data) boardData = leaderboardRes.data.data;

      setLeaderboard(boardData);
      setInviteCode(inviteRes.data?.code || inviteRes.data?.inviteCode || "");
    } catch (err) {
      setError("Error al cargar la información del grupo.");
      console.error(err);
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
