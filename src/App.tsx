
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./pages/Login";
import { DashboardPersonal } from "./pages/DashboardPersonal";
import { DashboardAluno } from "./pages/DashboardAluno";
import { Alunos } from "./pages/Alunos";
import { Exercicios } from "./pages/Exercicios";
import { Fichas } from "./pages/Fichas";
import { AlterarSenha } from "./pages/AlterarSenha";
import { RedefinirSenha } from "./pages/RedefinirSenha";

import { RotaProtegida } from "./components/RotaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Tela pública acessada pelo link enviado por e-mail */}
        <Route
          path="/redefinir-senha"
          element={<RedefinirSenha />}
        />

        {/* Área exclusiva do personal */}
        <Route
          path="/personal"
          element={
            <RotaProtegida permissoes={["PERSONAL"]}>
              <DashboardPersonal />
            </RotaProtegida>
          }
        />

        <Route
          path="/personal/alunos"
          element={
            <RotaProtegida permissoes={["PERSONAL"]}>
              <Alunos />
            </RotaProtegida>
          }
        />

        <Route
          path="/personal/exercicios"
          element={
            <RotaProtegida permissoes={["PERSONAL"]}>
              <Exercicios />
            </RotaProtegida>
          }
        />

        <Route
          path="/personal/fichas"
          element={
            <RotaProtegida permissoes={["PERSONAL"]}>
              <Fichas />
            </RotaProtegida>
          }
        />

        {/* Área exclusiva do aluno */}
        <Route
          path="/aluno"
          element={
            <RotaProtegida permissoes={["ALUNO"]}>
              <DashboardAluno />
            </RotaProtegida>
          }
        />

        <Route
          path="/aluno/alterar-senha"
          element={
            <RotaProtegida permissoes={["ALUNO"]}>
              <AlterarSenha />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
