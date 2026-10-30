# DigitalStore Backend

API REST para loja virtual construída com Node.js, Express, TypeScript e MySQL.

## 🛠 Tecnologias

- **Framework**: Express.js
- **Linguagem**: TypeScript
- **Banco de Dados**: MySQL
- **ORM**: TypeORM
- **Documentação**: Swagger UI
- **Containerização**: Docker & Docker Compose
- **Padrões**: SOLID Principles

## 📁 Estrutura do Projeto

```
src/
├── app.ts               # Configuração do Express
├── server.ts            # Ponto de entrada da aplicação
├── routes/
│   └── index.ts         # Roteamento principal
├── modules/
│   └── health/
│       └── controllers/
│           └── HealthController.ts
├── database/
│   └── data-source.ts   # Configuração do TypeORM
└── config/              # Configurações da aplicação
```

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

### Desenvolvimento

1. Clone o repositório
2. Copie o arquivo `.env.example` para `.env` e configure as variáveis
3. Inicie os containers:

```bash
docker-compose up -d
```

4. Acesse a API em: `http://localhost:3000`
5. Acesse a documentação Swagger em: `http://localhost:3000/api-docs`

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Executar migrations
npm run migrate

# Gerar nova migration
npm run generate
```

### Variáveis de Ambiente

```
NODE_ENV=development
PORT=3000
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_NAME=digitalstore
DATABASE_USER=root
DATABASE_PASSWORD=rootpassword
SWAGGER_ENABLE=true
SWAGGER_PATH=/api-docs
```

## 📖 Documentação da API

A documentação interativa está disponível em `/api-docs` quando a aplicação está rodando.

## 🐳 Docker

### Build da imagem

```bash
docker build -t digitalstore-api .
```

### Executar com Docker Compose

```bash
docker-compose up -d
```

### Parar containers

```bash
docker-compose down
```

### Parar e remover volumes

```bash
docker-compose down -v
```

## 🧪 Estrutura de Código

O projeto segue os princípios SOLID:

- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle  
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

## 📄 Licença

ISC