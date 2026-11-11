import { useState } from "react";
import { realizarLogin } from "../services/auth.service";
import { salvarAutenticacao } from "../services/auth-storage";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const dados = await realizarLogin({
        email,
        senha,
      });
      salvarAutenticacao(dados);

      if (dados.usuario.role === "PERSONAL") {
        navigate("/personal");
      } else {
        navigate("/aluno");
      }

    } catch (error: any) {
      setErro(
        error.response?.data?.mensagem ||
          "Não foi possível realizar o login.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1>Personal Trainer</h1>

      <p>Entre na sua conta para continuar.</p>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">E-mail</label>

        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Digite seu e-mail"
          required
        />

        <label htmlFor="senha">Senha</label>

        <input
          type="password"
          id="senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          placeholder="Digite sua senha"
          required
        />

        {erro && <p>{erro}</p>}

        <button type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}