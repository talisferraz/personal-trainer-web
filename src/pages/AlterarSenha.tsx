import { useState } from "react";
import { Layout } from "../components/Layout";
import { solicitarAlteracaoSenha } from "../services/recuperacao-senha.service";
import "../styles/senha.css";

export function AlterarSenha() {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function solicitarLink() {
    setMensagem("");
    setErro("");
    setCarregando(true);

    try {
      const resposta = await solicitarAlteracaoSenha();
      setMensagem(resposta.mensagem);
    } catch (error: any) {
      setErro(
        error.response?.data?.mensagem ||
          "Não foi possível solicitar a alteração de senha."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Layout>
      <div className="senha-container">
        <div className="senha-card">
          <h1>Alterar senha</h1>

          <p>
            Para alterar sua senha, enviaremos um link de redefinição
            para o seu e-mail cadastrado.
          </p>

          <button onClick={solicitarLink} disabled={carregando}>
            {carregando ? "Enviando..." : "Enviar link por e-mail"}
          </button>

          {mensagem && <p className="senha-sucesso">{mensagem}</p>}
          {erro && <p className="senha-erro">{erro}</p>}
        </div>
      </div>
    </Layout>
  );
}