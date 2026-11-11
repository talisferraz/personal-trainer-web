import { api } from "./api";

import type {
  Exercicio,
  ExercicioDados,
  ExercicioResposta,
} from "../types/exercicio";

// Lista os exercícios ativos.
export async function listarExercicios(): Promise<Exercicio[]> {
  const resposta = await api.get<Exercicio[]>("/exercicios");

  return resposta.data;
}

// Cadastra um exercício.
export async function cadastrarExercicio(
  dados: ExercicioDados,
): Promise<ExercicioResposta> {
  const resposta = await api.post<ExercicioResposta>(
    "/exercicios",
    dados,
  );

  return resposta.data;
}

// Atualiza um exercício.
export async function atualizarExercicio(
  id: number,
  dados: ExercicioDados,
): Promise<ExercicioResposta> {
  const resposta = await api.put<ExercicioResposta>(
    `/exercicios/${id}`,
    dados,
  );

  return resposta.data;
}

// Desativa um exercício.
export async function excluirExercicio(id: number): Promise<void> {
  await api.delete(`/exercicios/${id}`);
}