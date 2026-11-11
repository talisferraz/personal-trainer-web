import { api } from "./api";
import type { LoginDados, LoginResponse } from "../types/auth";

export async function realizarLogin(
  dados: LoginDados,
): Promise<LoginResponse> {
  const resposta = await api.post<LoginResponse>(
    "/auth/login",
    dados,
  );

  return resposta.data;
}