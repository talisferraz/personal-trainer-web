import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Layout } from "../components/Layout";

import {
  listarExercicios,
  cadastrarExercicio,
  atualizarExercicio,
  excluirExercicio,
} from "../services/exercicios.service";

import type { Exercicio } from "../types/exercicio";

import "../styles/exercicios.css";

export function Exercicios() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);

  const [nome, setNome] = useState("");
  const [grupoMuscular, setGrupoMuscular] = useState("");
  const [urlDemonstracao, setUrlDemonstracao] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Busca os exercícios cadastrados na API.
  async function carregarExercicios() {
    try {
      setErro("");

      const dados = await listarExercicios();

      setExercicios(dados);
    } catch {
      setErro("Não foi possível carregar os exercícios.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregarExercicios();
  }, []);

  // Filtra pelo nome ou grupo muscular.
  const exerciciosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();

    if (!termo) {
      return exercicios;
    }

    return exercicios.filter((exercicio) =>
      `${exercicio.nome} ${exercicio.grupoMuscular}`
        .toLowerCase()
        .includes(termo),
    );
  }, [exercicios, pesquisa]);

  // Limpa o formulário.
  function limparFormulario() {
    setNome("");
    setGrupoMuscular("");
    setUrlDemonstracao("");
    setEditandoId(null);
  }

  // Prepara o formulário para editar um exercício.
  function iniciarEdicao(exercicio: Exercicio) {
    setNome(exercicio.nome);
    setGrupoMuscular(exercicio.grupoMuscular);
    setUrlDemonstracao(exercicio.urlDemonstracao || "");
    setEditandoId(exercicio.id);

    setErro("");
    setMensagem("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Cadastra ou atualiza um exercício.
  async function handleSalvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setMensagem("");
    setSalvando(true);

    const dados = {
      nome: nome.trim(),
      grupoMuscular: grupoMuscular.trim(),
      urlDemonstracao: urlDemonstracao.trim() || null,
    };

    try {
      if (editandoId !== null) {
        await atualizarExercicio(editandoId, dados);

        setMensagem("Exercício atualizado com sucesso.");
      } else {
        await cadastrarExercicio(dados);

        setMensagem("Exercício cadastrado com sucesso.");
      }

      limparFormulario();

      await carregarExercicios();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível salvar o exercício.",
        );
      } else {
        setErro("Ocorreu um erro ao salvar o exercício.");
      }
    } finally {
      setSalvando(false);
    }
  }

  // Desativa um exercício.
  async function handleExcluir(exercicio: Exercicio) {
    const confirmou = window.confirm(
      `Deseja desativar o exercício "${exercicio.nome}"?`,
    );

    if (!confirmou) {
      return;
    }

    setErro("");
    setMensagem("");

    try {
      await excluirExercicio(exercicio.id);

      setExercicios((listaAtual) =>
        listaAtual.filter((item) => item.id !== exercicio.id),
      );

      if (editandoId === exercicio.id) {
        limparFormulario();
      }

      setMensagem("Exercício desativado com sucesso.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível desativar o exercício.",
        );
      } else {
        setErro("Ocorreu um erro ao desativar o exercício.");
      }
    }
  }

  return (
    <Layout>
      <section className="exercicios-page">
        <div className="exercicios-heading">
          <div>
            <h1>Exercícios</h1>
            <p>Gerencie sua biblioteca de exercícios.</p>
          </div>

          <span className="exercicios-total">
            {exercicios.length}{" "}
            {exercicios.length === 1 ? "exercício" : "exercícios"}
          </span>
        </div>

        {erro && (
          <div className="exercicios-alerta erro" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="exercicios-alerta sucesso" role="status">
            {mensagem}
          </div>
        )}

        <section className="exercicios-card">
          <h2>
            {editandoId !== null
              ? "Editar exercício"
              : "Cadastrar novo exercício"}
          </h2>

          <form onSubmit={handleSalvar} className="exercicios-form">
            <div className="campo-exercicio">
              <label htmlFor="nome">Nome do exercício</label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Ex.: Supino reto"
                required
              />
            </div>

            <div className="campo-exercicio">
              <label htmlFor="grupoMuscular">Grupo muscular</label>

              <input
                id="grupoMuscular"
                type="text"
                value={grupoMuscular}
                onChange={(event) => setGrupoMuscular(event.target.value)}
                placeholder="Ex.: Peito"
                required
              />
            </div>

            <div className="campo-exercicio">
              <label htmlFor="urlDemonstracao">
                URL de demonstração (opcional)
              </label>

              <input
                id="urlDemonstracao"
                type="url"
                value={urlDemonstracao}
                onChange={(event) =>
                  setUrlDemonstracao(event.target.value)
                }
                placeholder="https://..."
              />
            </div>

            <div className="exercicios-form-acoes">
              <button type="submit" disabled={salvando}>
                {salvando
                  ? "Salvando..."
                  : editandoId !== null
                    ? "Salvar alterações"
                    : "Cadastrar exercício"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  className="botao-cancelar"
                  onClick={limparFormulario}
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="exercicios-card">
          <div className="exercicios-lista-heading">
            <h2>Exercícios cadastrados</h2>

            <input
              type="search"
              value={pesquisa}
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar exercício..."
              aria-label="Pesquisar por nome ou grupo muscular"
            />
          </div>

          {carregando ? (
            <p className="exercicios-vazio">Carregando exercícios...</p>
          ) : exerciciosFiltrados.length === 0 ? (
            <p className="exercicios-vazio">
              {exercicios.length === 0
                ? "Nenhum exercício cadastrado."
                : "Nenhum exercício encontrado."}
            </p>
          ) : (
            <div className="exercicios-tabela-container">
              <table className="exercicios-tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Grupo muscular</th>
                    <th>Demonstração</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {exerciciosFiltrados.map((exercicio) => (
                    <tr key={exercicio.id}>
                      <td>{exercicio.nome}</td>

                      <td>{exercicio.grupoMuscular}</td>

                      <td>
                        {exercicio.urlDemonstracao ? (
                          <a
                            href={exercicio.urlDemonstracao}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver demonstração
                          </a>
                        ) : (
                          "Não informada"
                        )}
                      </td>

                      <td className="exercicios-acoes">
                        <button
                          type="button"
                          className="botao-editar"
                          onClick={() => iniciarEdicao(exercicio)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="botao-desativar"
                          onClick={() => handleExcluir(exercicio)}
                        >
                          Desativar
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