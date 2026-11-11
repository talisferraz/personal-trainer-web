import { api } from "./api";

import type {
  VersaoFicha,
  AtualizarFichaDados,
  FichaResposta,
} from "../types/ficha";

// Cria um rascunho ou recupera o que já existe.
export async function iniciarRascunho(
  alunoId: number,
): Promise<VersaoFicha> {
  const resposta = await api.post<VersaoFicha>(
    `/fichas/${alunoId}/rascunho`,
  );

  return resposta.data;
}

// Consulta o rascunho existente.
export async function consultarRascunho(
  alunoId: number,
): Promise<VersaoFicha> {
  const resposta = await api.get<VersaoFicha>(
    `/fichas/${alunoId}/rascunho`,
  );

  return resposta.data;
}

// Salva as alterações do rascunho.
export async function editarRascunho(
  alunoId: number,
  dados: AtualizarFichaDados,
): Promise<FichaResposta> {
  const resposta = await api.put<FichaResposta>(
    `/fichas/${alunoId}/rascunho`,
    dados,
  );

  return resposta.data;
}

// Publica o rascunho.
export async function publicarFicha(
  alunoId: number,
): Promise<FichaResposta> {
  const resposta = await api.post<FichaResposta>(
    `/fichas/${alunoId}/publicar`,
  );

  return resposta.data;
}

// Consulta a ficha atualmente publicada.
export async function consultarFichaAtual(
  alunoId: number,
): Promise<VersaoFicha> {
  const resposta = await api.get<VersaoFicha>(
    `/fichas/${alunoId}/atual`,
  );

  return resposta.data;
}

// Consulta o histórico de versões.
export async function consultarHistorico(
  alunoId: number,
): Promise<VersaoFicha[]> {
  const resposta = await api.get<VersaoFicha[]>(
    `/fichas/${alunoId}/historico`,
  );

  return resposta.data;
}

// Consulta a ficha do próprio aluno autenticado.
export async function consultarMinhaFicha(): Promise<VersaoFicha> {
  const resposta = await api.get<VersaoFicha>("/fichas/minha");

  return resposta.data;
}