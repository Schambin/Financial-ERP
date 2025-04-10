# 📊 Sistema de Contas Financeiras CLI

## 📌 Visão Geral

Sistema para controle de contas a pagar/receber com interface CLI nativa, desenvolvido com TypeScript seguindo princípios de Clean Code.

## 🚀 Começando

### Pré-requisitos

- Node.js v18+
- npm v10+

### Instalação

1. Clone o repositorio `git clone https://github.com/Schambin/Financial-ERP`
1. Vá até a pasta onde foi clonado `cd C:\Financial-ERP`
1. Execute `npm install`

## 🛠️ Uso

```
    npm run dev  #Modo de Desenvolvimento
    npm start    #Modo Prod
```

## 📋 Comandos

| Comando | Descrição                    |
| ------- | ---------------------------- |
| **1**   | Adicionar nova               |
| **2**   | Listar todas as contas       |
| **3**   | Marcar conta como paga       |
| **4**   | Visualizar resumo financeiro |
| **5**   | Buscar por ID                |
| **6**   | Sair do sistema              |

## 🛠️ Recursos Técnicos

| Característica    | Detalhes                            |
| ----------------- | ----------------------------------- |
| **Armazenamento** | Memória (volátil)                   |
| **Validações**    | Inputs rigorosos com feedback claro |
| **Interface**     | CLI nativa (readline)               |
| **Tipagem**       | TypeScript estático                 |
| **Formatação**    | Consistente em todos os outputs     |

## ✨ Funcionalidades

- **Adicionar novas transações**

  - Suporte a contas `a pagar` e `a receber`
  - Campos obrigatórios:
    - Descrição (texto livre)
    - Valor (número positivo com decimais ilimitados)
    - Data de vencimento (formato `YYYY-MM-DD`)
    - Tipo (1 - Pagar / 2 - Receber)

- **Listagem completa de contas**

  - Tipo (Pagar/Receber)
  - Descrição
  - Valor (R$ formatado)
  - Data de vencimento
  - Status (Pago / Pendente)
  - UUID único

- **Alteração de status**

  - Marcar contas como pagas:
    - Seleção por ID
    - Listagem apenas de pendentes

- **Resumo financeiro**

  - Total consolidado:
    - Contas a pagar
    - Contas a receber
    - Saldo líquido

- **Carga inicial automática**

  1. Aluguel (Pagar | R$1500 | 30d futuro | Pendente) [550e8400...]
  2. Salário (Receber | R$5000 | 5d futuro | Pendente) [6ba7b810...]
  3. Internet (Pagar | R$120.90 | 10d atrás | Pago) [98ae4068...]

- **Características dos Dados:**

  - IDs válidos no formato UUID v4
  - Datas no padrão ISO (YYYY-MM-DD)
  - Status refletindo situações reais (PENDING/PAID)
  - Valores com precisão decimal

## Estrutura do Projeto

```
Financial-ERP
├─ package-lock.json
├─ package.json
├─ readme.md
├─ requirements.md
├─ src
│  ├─ cli
│  │  └─ FinanceCLI.ts
│  ├─ index.ts (main)
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
