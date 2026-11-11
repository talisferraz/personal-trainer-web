/*import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("personal-trainer-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});*/

import axios from "axios";

import { removerAutenticacao } from "./auth-storage";

// Configuração central da comunicação com o backend.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição: adiciona o token JWT automaticamente.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("personal-trainer-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de resposta: identifica sessões inválidas ou expiradas.
api.interceptors.response.use(
  (resposta) => resposta,

  (erro) => {
    const url = erro.config?.url;

    // Não encerra a sessão por erro de credenciais no próprio login.
    const ehLogin = url?.includes("/auth/login");

    if (erro.response?.status === 401 && !ehLogin) {
      removerAutenticacao();

      // Retorna o usuário para a tela de login.
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(erro);
  }
);
