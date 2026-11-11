import type { LoginResponse, Usuario } from "../types/auth";

const CHAVE_TOKEN = "personal-trainer-token";
const CHAVE_USUARIO = "personal-trainer-usuario";

export function salvarAutenticacao(dados: LoginResponse) {
  localStorage.setItem(CHAVE_TOKEN, dados.token);

  localStorage.setItem(
    CHAVE_USUARIO,
    JSON.stringify(dados.usuario),
  );
}

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function obterUsuario(): Usuario | null {
  const usuario = localStorage.getItem(CHAVE_USUARIO);

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario) as Usuario;
  } catch {
    removerAutenticacao();
    return null;
  }
}

export function removerAutenticacao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}