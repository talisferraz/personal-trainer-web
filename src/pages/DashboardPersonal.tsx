import { Layout } from "../components/Layout";

export function DashboardPersonal() {
  return (
    <Layout>
      <section className="welcome-section">
        <h1>Visão geral</h1>
        <p>Bem-vindo ao gerenciamento dos seus alunos e treinos.</p>
      </section>

      <section className="dashboard-cards">
        <article className="dashboard-card">
          <span>Alunos cadastrados</span>
          <strong>Gerenciar alunos</strong>
          <p>Consulte e cadastre seus alunos.</p>
        </article>

        <article className="dashboard-card">
          <span>Exercícios</span>
          <strong>Biblioteca de exercícios</strong>
          <p>Organize os exercícios disponíveis.</p>
        </article>

        <article className="dashboard-card">
          <span>Fichas</span>
          <strong>Fichas de treino</strong>
          <p>Monte e publique os treinos.</p>
        </article>
      </section>
    </Layout>
  );
}