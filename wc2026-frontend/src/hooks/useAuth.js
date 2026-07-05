// src/hooks/useAuth.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // Aquí conectaremos con auth.service.js luego
      console.log("Enviando a API /auth/login:", credentials);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulando red

      // Si éxito: guardar token y redirigir
      navigate("/");
    } catch (error) {
      setServerError("Credenciales inválidas. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // Requerimiento PDF: registrar con nombre, correo y contraseña
      console.log("Enviando a API /auth/register:", userData);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulando red

      // Redirigir al login tras un registro exitoso
      navigate("/login");
    } catch (error) {
      setServerError(
        "Error al crear la cuenta. El correo podría estar en uso.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    registerUser,
    isLoading,
    serverError,
  };
}
