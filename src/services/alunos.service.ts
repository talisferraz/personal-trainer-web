import { api } from "./api";

import type {
  Aluno,
  CriarAlunoDados,
  CriarAlunoResposta,
} from "../types/aluno";

// Busca todos os alunos cadastrados.
export async function listarAlunos(): Promise<Aluno[]> {
  const resposta = await api.get<Aluno[]>("/alunos");

  return resposta.data;
}

// Cadastra um novo aluno.
export async function cadastrarAluno(
  dados: CriarAlunoDados,
): Promise<CriarAlunoResposta> {
  const resposta = await api.post<CriarAlunoResposta>(
    "/alunos",
    dados,
  );

  return resposta.data;
}

// Exclui um aluno pelo ID.
export async function excluirAluno(id: number): Promise<void> {
  await api.delete(`/alunos/${id}`);
}