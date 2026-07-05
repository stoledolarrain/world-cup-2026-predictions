import { useState, useCallback } from "react";
import api from "../services/api";

export default function useGroups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // useCallback evita que la función se recree en cada renderizado
  const fetchGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/groups");
      const groupsArray = Array.isArray(response.data)
        ? response.data
        : response.data?.groups || response.data?.data || [];
      setGroups(groupsArray);
      setError(null);
    } catch (err) {
      setError("Error al cargar tus grupos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createGroup = async (name) => {
    setActionLoading(true);
    try {
      await api.post("/groups", { name });
      await fetchGroups(); // Recarga la lista automáticamente
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Error al crear el grupo.",
      };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    groups,
    isLoading,
    error,
    actionLoading,
    fetchGroups,
    createGroup,
  };
}
