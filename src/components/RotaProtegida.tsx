import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { obterToken, obterUsuario } from "../services/auth-storage";
import type { Usuario } from "../types/auth";

interface RotaProtegidaProps {
  children: ReactNode;
  permissoes: Usuario["role"][];
}

export function RotaProtegida({
  children,
  permissoes,
}: RotaProtegidaProps) {
  const token = obterToken();
  const usuario = obterUsuario();

  if (!token || !usuario) {
    return <Navigate to="/" replace />;
  }

  if (!permissoes.includes(usuario.role)) {
    return (
      <Navigate
        to={usuario.role === "PERSONAL" ? "/personal" : "/aluno"}
        replace
      />
    );
  }

  return children;
}