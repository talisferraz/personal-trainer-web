import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { obterUsuario, removerAutenticacao } from "../services/auth-storage";
import "../styles/layout.css";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const usuario = obterUsuario();

  function sair() {
    removerAutenticacao();
    navigate("/", { replace: true });
  }

  const ehPersonal = usuario?.role === "PERSONAL";

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Personal<span>Fit</span></h2>
          <small>Gestão de treinos</small>
        </div>

        <nav className="sidebar-nav">
          <span className="menu-label">MENU PRINCIPAL</span>

          {ehPersonal ? (
            <>
              <a href="/personal">Visão geral</a>
              <Link to="/personal/alunos">Alunos</Link>
              <Link to="/personal/exercicios">Exercícios</Link>
              <Link to="/personal/fichas">Fichas de treino</Link>
            </>
          ) : (
            <>
              <a href="/aluno">Minha ficha</a>
              <Link to="/aluno/alterar-senha">Alterar senha</Link>
            </>
          )}
        </nav>

        <button className="logout-button" onClick={sair}>
          Sair da conta
        </button>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">Área de trabalho</span>
            <strong>{ehPersonal ? "Painel do Personal" : "Área do Aluno"}</strong>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {usuario?.nome.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{usuario?.nome}</strong>
              <small>{ehPersonal ? "Personal Trainer" : "Aluno"}</small>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}