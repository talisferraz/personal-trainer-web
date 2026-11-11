import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Layout } from "../components/Layout";
import {
  listarAlunos,
  cadastrarAluno,
  excluirAluno,
} from "../services/alunos.service";

import type { Aluno } from "../types/aluno";
import "../styles/alunos.css";

export function Alunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Carrega os alunos quando a página é aberta.
  async function carregarAlunos() {
    try {
      setErro("");

      const dados = await listarAlunos();

      setAlunos(dados);
    } catch {
      setErro("Não foi possível carregar os alunos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarAlunos();
  }, []);

  // Filtra os alunos pelo nome ou e-mail.
  const alunosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) {
      return alunos;
    }

    return alunos.filter((aluno) =>
      `${aluno.nome} ${aluno.email}`.toLowerCase().includes(termo),
    );
  }, [alunos, pesquisa]);

  // Envia os dados para a API.
  async function handleCadastrar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setMensagem("");
    setSalvando(true);

    try {
      const resultado = await cadastrarAluno({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        celular,
      });

      setAlunos((listaAtual) =>
        [...listaAtual, resultado.aluno].sort((a, b) =>
          a.nome.localeCompare(b.nome),
        ),
      );

      setNome("");
      setEmail("");
      setCelular("");

      setMensagem(
        "Aluno cadastrado! Os dados de acesso foram enviados por e-mail, caso o envio tenha sido concluído.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível cadastrar o aluno.",
        );
      } else {
        setErro("Ocorreu um erro ao cadastrar o aluno.");
      }
    } finally {
      setSalvando(false);
    }
  }

  // Exclui permanentemente o aluno.
  async function handleExcluir(aluno: Aluno) {
    const confirmou = window.confirm(
      `Deseja realmente excluir ${aluno.nome}?\n\nEssa ação também excluirá os dados e o histórico de treinos desse aluno e não poderá ser desfeita.`,
    );

    if (!confirmou) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await excluirAluno(aluno.id);

      setAlunos((listaAtual) =>
        listaAtual.filter((item) => item.id !== aluno.id),
      );

      setMensagem("Aluno excluído com sucesso.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível excluir o aluno.",
        );
      } else {
        setErro("Ocorreu um erro ao excluir o aluno.");
      }
    }
  }

  return (
    <Layout>
      <section className="alunos-page">
        <div className="alunos-heading">
          <div>
            <h1>Alunos</h1>
            <p>Cadastre e gerencie seus alunos.</p>
          </div>

          <span className="alunos-total">
            {alunos.length} {alunos.length === 1 ? "aluno" : "alunos"}
          </span>
        </div>

        {erro && (
          <div className="alunos-alerta erro" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="alunos-alerta sucesso" role="status">
            {mensagem}
          </div>
        )}

        <section className="alunos-card">
          <h2>Cadastrar novo aluno</h2>

          <form onSubmit={handleCadastrar} className="alunos-form">
            <div className="campo">
              <label htmlFor="nome">Nome completo</label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Nome do aluno"
                required
                maxLength={120}
              />
            </div>

            <div className="campo">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="aluno@email.com"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="celular">Celular com DDD</label>

              <input
                id="celular"
                type="tel"
                value={celular}
                onChange={(event) => setCelular(event.target.value)}
                placeholder="(11) 99999-9999"
                required
                maxLength={15}
              />
            </div>

            <button type="submit" disabled={salvando}>
              {salvando ? "Cadastrando..." : "Cadastrar aluno"}
            </button>
          </form>

          <p className="alunos-observacao">
            A senha inicial será formada pelos últimos nove dígitos do
            celular e enviada ao e-mail cadastrado.
          </p>
        </section>

        <section className="alunos-card">
          <div className="alunos-lista-heading">
            <h2>Alunos cadastrados</h2>

            <input
              type="search"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar aluno..."
              aria-label="Pesquisar aluno por nome ou e-mail"
            />
          </div>

          {carregando ? (
            <p className="alunos-vazio">Carregando alunos...</p>
          ) : alunosFiltrados.length === 0 ? (
            <p className="alunos-vazio">
              {alunos.length === 0
                ? "Nenhum aluno cadastrado."
                : "Nenhum aluno encontrado para essa pesquisa."}
            </p>
          ) : (
            <div className="tabela-container">
              <table className="alunos-tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Celular</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.celular}</td>
                      <td>
                        {new Date(aluno.criadoEm).toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="botao-excluir"
                          onClick={() => handleExcluir(aluno)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </Layout>
  );
}