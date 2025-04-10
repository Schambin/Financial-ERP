# 📊 Sistema de Contas Financeiras CLI

## 📌 Visão Geral
Sistema para controle de contas a pagar/receber com interface CLI nativa, desenvolvido com TypeScript seguindo princípios de Clean Code.

### Pré-requisitos
- Node.js v18+
- npm v9+

### Instalação
```bash
    git clone https://github.com/Schambin/Financial-ERP
    cd toPayToReceive
    npm install 
```

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