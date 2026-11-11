import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { redefinirSenha } from "../services/recuperacao-senha.service";
import "../styles/senha.css";

export function RedefinirSenha() {
  const [parametros] = useSearchParams();
  const token = parametros.get("token") || "";

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function salvarNovaSenha(event: React.FormEvent) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    if (!token) {
      setErro("Link inválido ou sem token.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await redefinirSenha({
        token,
        novaSenha,
        confirmarSenha,
      });

      setMensagem(resposta.mensagem);
    } catch (error: any) {
      setErro(
        error.response?.data?.mensagem ||
          "Não foi possível redefinir sua senha."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="senha-container">
      <div className="senha-card">
        <h1>Nova senha</h1>

        <p>Digite sua nova senha e confirme para continuar.</p>

        <form onSubmit={salvarNovaSenha}>
          <label>Nova senha</label>
          <input
            type="password"
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
            minLength={8}
            required
          />

          <label>Confirmar nova senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(event) => setConfirmarSenha(event.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>

        {mensagem && (
          <p className="senha-sucesso">
            {mensagem}
            <br />
            <Link to="/">Voltar para o login</Link>
          </p>
        )}

        {erro && <p className="senha-erro">{erro}</p>}
      </div>
    </div>
  );
}