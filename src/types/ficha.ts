// Dados de um exercício da biblioteca.
export interface ExercicioFicha {
    id: number;
    nome: string;
    grupoMuscular: string;
    urlDemonstracao: string | null;
  }
  
  // Exercício dentro de uma divisão de treino.
  export interface ItemTreino {
    id?: number;
    exercicioId: number;
    series: number;
    repeticoes: string;
    descansoSegundos: number;
    ordem: number;
  
    // Pode não vir na resposta inicial da criação do rascunho.
    exercicio?: ExercicioFicha;
  }
  
  // Uma divisão, como Treino A, Treino B ou Treino C.
  export interface Treino {
    id?: number;
    nome: string;
    descricao: string | null;
    ordem: number;
    exercicios: ItemTreino[];
  }
  
  // Versão completa de uma ficha.
  export interface VersaoFicha {
    id: number;
    fichaId: number;
    numero: number;
    status: "RASCUNHO" | "ATUAL" | "HISTORICO";
    criadoEm: string;
    publicadaEm: string | null;
    treinos: Treino[];
  }
  
  // Dados enviados ao backend para salvar um rascunho.
  export interface AtualizarFichaDados {
    treinos: Treino[];
  }
  
  // Resposta das operações de edição e publicação.
  export interface FichaResposta {
    mensagem: string;
    ficha: VersaoFicha;
  }