export interface Aluno {
    id: number;
    nome: string;
    email: string;
    celular: string;
    criadoEm: string;
  }
  
  export interface CriarAlunoDados {
    nome: string;
    email: string;
    celular: string;
  }
  
  export interface CriarAlunoResposta {
    mensagem: string;
    aluno: Aluno;
  }