import { useEffect, useState } from "react";
import axios from "axios";

import { Layout } from "../components/Layout";

import { listarAlunos } from "../services/alunos.service";
import { listarExercicios } from "../services/exercicios.service";

import {
  iniciarRascunho,
  consultarFichaAtual,
  consultarHistorico,
  editarRascunho,
  publicarFicha,
} from "../services/fichas.service";

import type { Aluno } from "../types/aluno";
import type { Exercicio } from "../types/exercicio";

import type {
  VersaoFicha,
  Treino,
  ItemTreino,
} from "../types/ficha";

import "../styles/fichas.css";

export function Fichas() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);

  const [alunoId, setAlunoId] = useState("");
  const [rascunho, setRascunho] = useState<VersaoFicha | null>(null);
  const [fichaAtual, setFichaAtual] = useState<VersaoFicha | null>(null);
  const [historico, setHistorico] = useState<VersaoFicha[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Carrega alunos e exercícios quando a página abre.
  useEffect(() => {
    async function carregarDados() {
      try {
        const [listaAlunos, listaExercicios] = await Promise.all([
          listarAlunos(),
          listarExercicios(),
        ]);

        setAlunos(listaAlunos);
        setExercicios(listaExercicios);
      } catch {
        setErro("Não foi possível carregar alunos e exercícios.");
      } finally {
        setCarregando(false);
      }
    }

    void carregarDados();
  }, []);

  // Consulta ficha atual e histórico do aluno selecionado.
  async function carregarFichaAluno(id: number) {
    setRascunho(null);
    setFichaAtual(null);
    setHistorico([]);

    try {
      const [atual, versoes] = await Promise.all([
        consultarFichaAtual(id).catch(() => null),
        consultarHistorico(id).catch(() => []),
      ]);

      setFichaAtual(atual);
      setHistorico(versoes);
    } catch {
      setErro("Não foi possível consultar os dados da ficha.");
    }
  }

  // Seleciona um aluno.
  function handleSelecionarAluno(valor: string) {
    setAlunoId(valor);
    setRascunho(null);
    setFichaAtual(null);
    setHistorico([]);
    setErro("");
    setMensagem("");

    if (valor) {
      void carregarFichaAluno(Number(valor));
    }
  }

  // Cria ou recupera um rascunho.
  async function handleIniciarRascunho() {
    if (!alunoId) return;

    setErro("");
    setMensagem("");

    try {
      const dados = await iniciarRascunho(Number(alunoId));

      setRascunho(dados);
      setMensagem("Rascunho carregado com sucesso.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível iniciar o rascunho.",
        );
      } else {
        setErro("Ocorreu um erro ao iniciar o rascunho.");
      }
    }
  }

  // Adiciona uma divisão de treino.
  function adicionarTreino() {
    if (!rascunho) return;

    const novoTreino: Treino = {
      nome: `Treino ${String.fromCharCode(65 + rascunho.treinos.length)}`,
      descricao: null,
      ordem: rascunho.treinos.length + 1,
      exercicios: [],
    };

    setRascunho({
      ...rascunho,
      treinos: [...rascunho.treinos, novoTreino],
    });
  }

  // Atualiza um treino.
  function atualizarTreino(
    indiceTreino: number,
    dados: Partial<Treino>,
  ) {
    if (!rascunho) return;

    const treinos = rascunho.treinos.map((treino, indice) =>
      indice === indiceTreino
        ? { ...treino, ...dados }
        : treino,
    );

    setRascunho({ ...rascunho, treinos });
  }

  // Remove uma divisão.
  function removerTreino(indiceTreino: number) {
    if (!rascunho) return;

    const treinos = rascunho.treinos
      .filter((_, indice) => indice !== indiceTreino)
      .map((treino, indice) => ({
        ...treino,
        ordem: indice + 1,
      }));

    setRascunho({ ...rascunho, treinos });
  }

  // Adiciona um exercício à divisão.
  function adicionarExercicio(indiceTreino: number) {
    if (!rascunho) return;

    const treino = rascunho.treinos[indiceTreino];

    const novoItem: ItemTreino = {
      exercicioId: 0,
      series: 3,
      repeticoes: "12",
      descansoSegundos: 60,
      ordem: treino.exercicios.length + 1,
    };

    atualizarTreino(indiceTreino, {
      exercicios: [...treino.exercicios, novoItem],
    });
  }

  // Atualiza um exercício dentro da divisão.
  function atualizarExercicio(
    indiceTreino: number,
    indiceExercicio: number,
    dados: Partial<ItemTreino>,
  ) {
    if (!rascunho) return;

    const treino = rascunho.treinos[indiceTreino];

    const exercicios = treino.exercicios.map((item, indice) =>
      indice === indiceExercicio
        ? { ...item, ...dados }
        : item,
    );

    atualizarTreino(indiceTreino, { exercicios });
  }

  // Remove um exercício da divisão.
  function removerExercicio(
    indiceTreino: number,
    indiceExercicio: number,
  ) {
    if (!rascunho) return;

    const treino = rascunho.treinos[indiceTreino];

    const exercicios = treino.exercicios
      .filter((_, indice) => indice !== indiceExercicio)
      .map((item, indice) => ({
        ...item,
        ordem: indice + 1,
      }));

    atualizarTreino(indiceTreino, { exercicios });
  }

  // Salva o rascunho no backend.

async function handleSalvarRascunho(): Promise<boolean> {
    if (!rascunho || !alunoId) return false;
  
    setErro("");
    setMensagem("");
  
    // Valida os dados antes de enviar para a API.
    const treinoInvalido = rascunho.treinos.some(
      (treino) =>
        !treino.nome.trim() ||
        treino.exercicios.some(
          (item) =>
            item.exercicioId <= 0 ||
            item.series <= 0 ||
            !item.repeticoes.trim() ||
            item.descansoSegundos < 0
        )
    );
  
    if (treinoInvalido) {
      setErro(
        "Preencha o nome de cada treino e todos os dados dos exercícios. Selecione um exercício da biblioteca."
      );
      return false;
    }
  
    setSalvando(true);
  
    try {
      const dados = {
        treinos: rascunho.treinos.map((treino, indiceTreino) => ({
          nome: treino.nome.trim(),
          descricao: treino.descricao,
          ordem: indiceTreino + 1,
          exercicios: treino.exercicios.map((item, indiceExercicio) => ({
            exercicioId: item.exercicioId,
            series: item.series,
            repeticoes: item.repeticoes,
            descansoSegundos: item.descansoSegundos,
            ordem: indiceExercicio + 1,
          })),
        })),
      };
  
      await editarRascunho(Number(alunoId), dados);
  
      setMensagem("Rascunho salvo com sucesso.");
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível salvar o rascunho."
        );
      } else {
        setErro("Ocorreu um erro ao salvar o rascunho.");
      }
  
      return false;
    } finally {
      setSalvando(false);
    }
  }
  
  /*async function handleSalvarRascunho() {
    if (!rascunho || !alunoId) return;

    setErro("");
    setMensagem("");
    setSalvando(true);

    try {
      const dados = {
        treinos: rascunho.treinos.map((treino, indiceTreino) => ({
          nome: treino.nome.trim(),
          descricao: treino.descricao,
          ordem: indiceTreino + 1,
          exercicios: treino.exercicios.map((item, indiceExercicio) => ({
            exercicioId: item.exercicioId,
            series: item.series,
            repeticoes: item.repeticoes,
            descansoSegundos: item.descansoSegundos,
            ordem: indiceExercicio + 1,
          })),
        })),
      };

      await editarRascunho(Number(alunoId), dados);

      setMensagem("Rascunho salvo com sucesso.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível salvar o rascunho.",
        );
      } else {
        setErro("Ocorreu um erro ao salvar o rascunho.");
      }
    } finally {
      setSalvando(false);
    }
  }
*/
  // Publica a versão salva.

async function handlePublicar() {
    if (!alunoId || !rascunho) return;
  
    const confirmou = window.confirm(
      "Deseja publicar esta ficha? A versão atual passará para o histórico."
    );
  
    if (!confirmou) return;
  
    setErro("");
    setMensagem("");
  
    // Só publica se o salvamento do rascunho funcionar.
    const salvo = await handleSalvarRascunho();
  
    if (!salvo) return;
  
    try {
      const resultado = await publicarFicha(Number(alunoId));
  
      setRascunho(null);
      setMensagem(resultado.mensagem);
  
      await carregarFichaAluno(Number(alunoId));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível publicar a ficha."
        );
      } else {
        setErro("Ocorreu um erro ao publicar a ficha.");
      }
    }
  }
  

  /*async function handlePublicar() {
    if (!alunoId || !rascunho) return;

    const confirmou = window.confirm(
      "Deseja publicar esta ficha? A versão atual passará para o histórico.",
    );

    if (!confirmou) return;

    setErro("");
    setMensagem("");

    try {
      // Salva as últimas alterações antes de publicar.
      await handleSalvarRascunho();

      const resultado = await publicarFicha(Number(alunoId));

      setRascunho(null);
      setMensagem(resultado.mensagem);

      await carregarFichaAluno(Number(alunoId));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErro(
          error.response?.data?.mensagem ||
            "Não foi possível publicar a ficha.",
        );
      } else {
        setErro("Ocorreu um erro ao publicar a ficha.");
      }
    }
  }*/

  return (
    <Layout>
      <section className="fichas-page">
        <div className="fichas-heading">
          <div>
            <h1>Fichas de treino</h1>
            <p>Monte, organize e publique os treinos dos seus alunos.</p>
          </div>
        </div>

        {erro && (
          <div className="fichas-alerta erro" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="fichas-alerta sucesso" role="status">
            {mensagem}
          </div>
        )}

        <section className="fichas-card">
          <label htmlFor="alunoFicha">Selecione um aluno</label>

          <select
            id="alunoFicha"
            value={alunoId}
            onChange={(event) => handleSelecionarAluno(event.target.value)}
            disabled={carregando}
          >
            <option value="">Selecione...</option>

            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>

          {carregando && <p>Carregando dados...</p>}

          {!carregando && alunos.length === 0 && (
            <p>Nenhum aluno cadastrado.</p>
          )}
        </section>

        {alunoId && (
          <>
            <section className="fichas-card">
              <div className="fichas-versao-heading">
                <div>
                  <h2>Ficha atual</h2>
                  <p>
                    {fichaAtual
                      ? `Versão ${fichaAtual.numero} publicada`
                      : "Este aluno ainda não possui ficha publicada."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleIniciarRascunho}
                  disabled={Boolean(rascunho)}
                >
                  {rascunho ? "Rascunho aberto" : "Criar / editar ficha"}
                </button>
              </div>
            </section>

            {rascunho && (
              <section className="fichas-editor">
                <div className="fichas-editor-heading">
                  <div>
                    <h2>Editando rascunho</h2>
                    <p>Versão {rascunho.numero}</p>
                  </div>

                  <button type="button" onClick={adicionarTreino}>
                    + Adicionar treino
                  </button>
                </div>

                {rascunho.treinos.map((treino, indiceTreino) => (
                  <article className="treino-card" key={treino.id ?? indiceTreino}>
                    <div className="treino-heading">
                      <input
                        type="text"
                        value={treino.nome}
                        onChange={(event) =>
                          atualizarTreino(indiceTreino, {
                            nome: event.target.value,
                          })
                        }
                        aria-label="Nome da divisão"
                      />

                      <button
                        type="button"
                        className="botao-remover"
                        onClick={() => removerTreino(indiceTreino)}
                      >
                        Remover treino
                      </button>
                    </div>

                    <div className="campo-ficha">
                      <label>Descrição (opcional)</label>

                      <input
                        type="text"
                        value={treino.descricao || ""}
                        onChange={(event) =>
                          atualizarTreino(indiceTreino, {
                            descricao: event.target.value || null,
                          })
                        }
                        placeholder="Ex.: Peito e tríceps"
                      />
                    </div>

                    {treino.exercicios.map((item, indiceExercicio) => (
                      <div
                        className="exercicio-ficha"
                        key={item.id ?? indiceExercicio}
                      >
                        <div className="campo-ficha exercicio-selecao">
                          <label>Exercício</label>

                          <select
                            value={item.exercicioId || ""}
                            onChange={(event) =>
                              atualizarExercicio(
                                indiceTreino,
                                indiceExercicio,
                                { exercicioId: Number(event.target.value) },
                              )
                            }
                            required
                          >
                            <option value="">Selecione...</option>

                            {exercicios.map((exercicio) => (
                              <option
                                key={exercicio.id}
                                value={exercicio.id}
                              >
                                {exercicio.nome} ({exercicio.grupoMuscular})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="campo-ficha">
                          <label>Séries</label>

                          <input
                            type="number"
                            min="1"
                            value={item.series}
                            onChange={(event) =>
                              atualizarExercicio(
                                indiceTreino,
                                indiceExercicio,
                                { series: Number(event.target.value) },
                              )
                            }
                          />
                        </div>

                        <div className="campo-ficha">
                          <label>Repetições</label>

                          <input
                            type="text"
                            value={item.repeticoes}
                            onChange={(event) =>
                              atualizarExercicio(
                                indiceTreino,
                                indiceExercicio,
                                { repeticoes: event.target.value },
                              )
                            }
                            placeholder="Ex.: 3x12"
                          />
                        </div>

                        <div className="campo-ficha">
                          <label>Descanso (segundos)</label>

                          <input
                            type="number"
                            min="0"
                            value={item.descansoSegundos}
                            onChange={(event) =>
                              atualizarExercicio(
                                indiceTreino,
                                indiceExercicio,
                                {
                                  descansoSegundos: Number(event.target.value),
                                },
                              )
                            }
                          />
                        </div>

                        <button
                          type="button"
                          className="botao-remover"
                          onClick={() =>
                            removerExercicio(indiceTreino, indiceExercicio)
                          }
                        >
                          Remover
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="botao-adicionar-exercicio"
                      onClick={() => adicionarExercicio(indiceTreino)}
                    >
                      + Adicionar exercício
                    </button>
                  </article>
                ))}

                {rascunho.treinos.length === 0 && (
                  <p className="fichas-vazio">
                    Nenhuma divisão criada. Adicione o primeiro treino.
                  </p>
                )}

                <div className="fichas-editor-acoes">
                  <button
                    type="button"
                    onClick={handleSalvarRascunho}
                    disabled={salvando}
                  >
                    {salvando ? "Salvando..." : "Salvar rascunho"}
                  </button>

                  <button
                    type="button"
                    className="botao-publicar"
                    onClick={handlePublicar}
                    disabled={salvando || rascunho.treinos.length === 0}
                  >
                    Publicar ficha
                  </button>
                </div>
              </section>
            )}

            {historico.length > 0 && (
              <section className="fichas-card">
                <h2>Histórico de versões</h2>

                <div className="historico-lista">
                  {historico.map((versao) => (
                    <div className="historico-item" key={versao.id}>
                      <div>
                        <strong>Versão {versao.numero}</strong>

                        <small>
                          {versao.publicadaEm
                            ? new Date(versao.publicadaEm).toLocaleDateString("pt-BR")
                            : "Data não disponível"}
                        </small>
                      </div>

                      <span
                        className={
                          versao.status === "ATUAL"
                            ? "status-atual"
                            : "status-historico"
                        }
                      >
                        {versao.status === "ATUAL" ? "Atual" : "Histórico"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {fichaAtual && (
              <section className="fichas-card">
                <h2>Treinos publicados</h2>

                {fichaAtual.treinos.map((treino) => (
                  <article className="treino-publicado" key={treino.id}>
                    <h3>{treino.nome}</h3>

                    {treino.descricao && <p>{treino.descricao}</p>}

                    {treino.exercicios.map((item) => (
                      <div className="item-publicado" key={item.id}>
                        <strong>
                          {item.exercicio?.nome || "Exercício"}
                        </strong>

                        <span>
                          {item.series} séries × {item.repeticoes}
                        </span>

                        <small>
                          Descanso: {item.descansoSegundos} segundos
                        </small>
                      </div>
                    ))}
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}