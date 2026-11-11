# PersonalFit

Sistema de gerenciamento de treinos desenvolvido para personal trainers e seus alunos.

O projeto permite que o personal gerencie alunos, cadastre exercícios e monte fichas de treino personalizadas. Os alunos podem acessar suas fichas e solicitar a alteração de senha por e-mail.

## Funcionalidades

### Personal Trainer
- Login e autenticação.
- Cadastro, consulta e exclusão de alunos.
- Cadastro, edição e desativação de exercícios.
- Criação e edição de fichas de treino.
- Publicação de fichas para os alunos.
- Histórico de versões das fichas.

### Aluno
- Login e acesso à área individual.
- Visualização da própria ficha de treino.
- Consulta dos exercícios, séries, repetições e descanso.
- Solicitação de alteração de senha por e-mail.
- Redefinição de senha por link com token.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS

## Integração com o backend

O frontend consome uma API REST desenvolvida separadamente.

Tecnologias do backend:
- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd personal-trainer-web
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

O endereço deve apontar para a URL onde o backend está sendo executado.

### 4. Iniciar o frontend

```bash
npm run dev
```

O Vite disponibilizará a aplicação em:

`http://localhost:5173`

### 5. Gerar a versão de produção

```bash
npm run build
```

## Estrutura do projeto

```text
personal-trainer-web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Status do projeto

**Versão 1.0.0**

Primeira versão funcional do PersonalFit, com autenticação, gerenciamento de alunos, exercícios e fichas de treino, além da integração entre frontend e backend.

O projeto continuará recebendo melhorias e novas funcionalidades.