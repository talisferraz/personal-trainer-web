export interface Usuario {
    id: number;
    nome: string;
    email: string;
    role: "PERSONAL" | "ALUNO";
  }
  
  export interface LoginResponse {
    usuario: Usuario;
    token: string;
  }
  
  export interface LoginDados {
    email: string;
    senha: string;
  }