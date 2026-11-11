export interface Exercicio {
    id: number;
    nome: string;
    grupoMuscular: string;
    urlDemonstracao: string | null;
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
  }
  
  export interface ExercicioDados {
    nome: string;
    grupoMuscular: string;
    urlDemonstracao: string | null;
  }
  
  export interface ExercicioResposta {
    mensagem: string;
    exercicio: Exercicio;
  }