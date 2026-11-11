/*import { Layout } from "../components/Layout";

export function DashboardAluno() {
  return (
    <Layout>
      <section className="welcome-section">
        <h1>Minha área</h1>
        <p>Acompanhe sua ficha e consulte seus treinos.</p>
      </section>

      <section className="dashboard-cards">
        <article className="dashboard-card">
          <span>Minha ficha</span>
          <strong>Ficha de treino atual</strong>
          <p>Consulte os exercícios definidos pelo seu personal.</p>
        </article>

        <article className="dashboard-card">
          <span>Divisões</span>
          <strong>Treinos A, B e C</strong>
          <p>Acesse a divisão correspondente ao seu treino.</p>
        </article>
      </section>
    </Layout>
  );
}*/

import { useEffect, useState } from "react";
import axios from "axios";

import { Layout } from "../components/Layout";
import { consultarMinhaFicha } from "../services/fichas.service";

import type { VersaoFicha } from "../types/ficha";

import "../styles/aluno.css";

export function DashboardAluno() {
  const [ficha, setFicha] = useState<VersaoFicha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarFicha() {
      try {
        const dados = await consultarMinhaFicha();
        setFicha(dados);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErro("Você ainda não possui uma ficha de treino publicada.");
          } else {
            setErro(
              error.response?.data?.mensagem ||
                "Não foi possível carregar sua ficha."
            );
          }
        } else {
          setErro("Ocorreu um erro ao carregar sua ficha.");
        }
      } finally {
        setCarregando(false);
      }
    }

    void carregarFicha();
  }, []);

  return (
    <Layout>
      <section className="aluno-page">
        <div className="aluno-heading">
          <div>
            <h1>Minha ficha de treino</h1>
            <p>Acompanhe seus exercícios e sua evolução.</p>
          </div>
        </div>

        {carregando && (
          <div className="aluno-card">
            <p>Carregando sua ficha...</p>
          </div>
        )}

        {!carregando && erro && (
          <div className="aluno-alerta">
            {erro}
          </div>
        )}

        {!carregando && ficha && (
          <>
            <div className="aluno-resumo">
              <div className="aluno-card">
                <span>Versão da ficha</span>
                <strong>{ficha.numero}</strong>
              </div>

              <div className="aluno-card">
                <span>Divisões de treino</span>
                <strong>{ficha.treinos.length}</strong>
              </div>

              <div className="aluno-card">
                <span>Publicada em</span>
                <strong>
                  {ficha.publicadaEm
                    ? new Date(ficha.publicadaEm).toLocaleDateString("pt-BR")
                    : "Não informada"}
                </strong>
              </div>
            </div>

            <div className="aluno-treinos">
              <h2>Seus treinos</h2>

              {ficha.treinos.map((treino) => (
                <article className="aluno-treino-card" key={treino.id}>
                  <div className="aluno-treino-heading">
                    <div>
                      <span>DIVISÃO {treino.ordem}</span>
                      <h3>{treino.nome}</h3>
                      {treino.descricao && <p>{treino.descricao}</p>}
                    </div>
                  </div>

                  {treino.exercicios.map((item) => (
                    <div className="aluno-exercicio" key={item.id}>
                      <div className="aluno-exercicio-info">
                        <strong>
                          {item.exercicio?.nome || "Exercício"}
                        </strong>

                        <span>
                          {item.exercicio?.grupoMuscular || "Grupo muscular não informado"}
                        </span>
                      </div>

                      <div className="aluno-exercicio-dados">
                        <div>
                          <strong>{item.series}</strong>
                          <small>Séries</small>
                        </div>

                        <div>
                          <strong>{item.repeticoes}</strong>
                          <small>Repetições</small>
                        </div>

                        <div>
                          <strong>{item.descansoSegundos}s</strong>
                          <small>Descanso</small>
                        </div>
                      </div>

                      {item.exercicio?.urlDemonstracao && (
                        <a
                          href={item.exercicio.urlDemonstracao}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aluno-link-demonstracao"
                        >
                          Ver demonstração
                        </a>
                      )}
                    </div>
                  ))}

                  {treino.exercicios.length === 0 && (
                    <p className="aluno-vazio">
                      Nenhum exercício cadastrado nesta divisão.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
