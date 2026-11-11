import { api } from "./api";

// Solicita o envio do link de alteração de senha
export async function solicitarAlteracaoSenha(): Promise<{ mensagem: string }> {
  const resposta = await api.post<{ mensagem: string }>(
    "/auth/solicitar-alteracao-senha"
  );

  return resposta.data;
}

// Redefine a senha usando o token recebido por e-mail
export async function redefinirSenha(dados: {
  token: string;
  novaSenha: string;
  confirmarSenha: string;
}): Promise<{ mensagem: string }> {
  const resposta = await api.post<{ mensagem: string }>(
    "/auth/redefinir-senha",
    dados
  );

  return resposta.data;
}