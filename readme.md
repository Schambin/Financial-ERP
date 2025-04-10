# 📊 Sistema de Contas Financeiras CLI

## 📌 Visão Geral

Sistema para controle de contas a pagar/receber com interface CLI nativa, desenvolvido com TypeScript seguindo princípios de Clean Code.

### Foi Utilizado 
- npm 10.8.2
- Node 18.20.5
- Typescript 5.8.3

## 🚀 Começando

### Pré-requisitos

- Node.js v18+
- npm v10+

### Instalação
1. Clone o repositorio
2. Vá até a pasta mãe
3. Execute npm install
```bash
    git clone https://github.com/Schambin/Financial-ERP
    cd toPayToReceive
    npm install
```

## 🛠️ Uso

```
npm run dev  #Modo de Desenvolvimento
npm start    #Modo Prod
```

## 📋 Comandos / Funcionalidades

### Comando e Descrição
```
1.  Adicionar nova conta
2.  Listar todas as contas
3.  Marcar conta como paga
4.  Visualizar resumo financeiro
5.  Sair do sistema
```

## Estrutura do Projeto

```
toPayToReceive
├─ package-lock.json
├─ package.json
├─ readme.md
├─ requirements.md
├─ src
│  ├─ cli
│  │  └─ FinanceCLI.ts
│  ├─ index.ts
│  ├─ models
│  │  ├─ Account.ts
│  │  └─ AccountType.ts
│  ├─ services
│  │  ├─ AccountService.ts
│  │  └─ SummaryService.ts
│  └─ utils
│     └─ DateUtils.ts
└─ tsconfig.json
```
