# DigitalStore Backend

API REST para loja virtual construída com Node.js, Express, Sequelize e MySQL.

## 🛠 Tecnologias

- **Framework**: Express.js
- **Linguagem**: JavaScript (Node.js)
- **Banco de Dados**: MySQL
- **ORM**: Sequelize
- **Autenticação**: JWT
- **Documentação**: Swagger UI
- **Testes**: Jest + Supertest
- **Desenvolvimento**: Nodemon
- **Containerização**: Docker & Docker Compose

## 📁 Estrutura do Projeto

```
project-root/
├── src/
│   ├── config/          # Configurações da aplicação
│   ├── controllers/     # Controladores das rotas
│   ├── middleware/      # Middlewares personalizados
│   ├── models/          # Models do Sequelize
│   ├── routes/          # Rotas da API
│   ├── services/        # Lógica de negócio
│   ├── app.js           # Configuração do Express
│   └── server.js        # Ponto de entrada da aplicação
├── tests/               # Testes automatizados
├── docker/
│   └── mysql/
│       └── init/        # Scripts de inicialização do MySQL
├── .env                 # Variáveis de ambiente (copiar de .env.example)
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── swagger.yaml
```

## 🚀 Começando

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose (opcional)
- npm

### Instalação Local

1. Clone o repositório
2. Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o MySQL (com Docker ou localmente):

**Com Docker:**
```bash
docker-compose up -d mysql
```

5. Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

6. Acesse a API em: `http://localhost:3000`
7. Acesse a documentação Swagger em: `http://localhost:3000/api-docs`

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

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

### Ver logs

```bash
docker-compose logs -f
```

## 📖 Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=digitalstore
DB_USER=root
DB_PASSWORD=rootpassword

# JWT
JWT_SECRET=seu-segredo-super-secreto-aqui
JWT_EXPIRES_IN=1d

# Swagger
SWAGGER_PATH=/api-docs
```

## 📖 Documentação da API

A documentação interativa está disponível em `/api-docs` quando a aplicação está rodando.

### Endpoints

- `GET /api/health` - Health Check

## 🧪 Estrutura de Código

O projeto segue boas práticas de desenvolvimento:
- Separação de responsabilidades (MVC)
- Middlewares para autenticação e tratamento de erros
- Models com Sequelize para persistência
- Services para lógica de negócio
- Testes automatizados com Jest

## 🔒 Autenticação JWT

Para proteger rotas, use o middleware `auth`:

```javascript
const authMiddleware = require('./middleware/auth');

router.get('/protected', authMiddleware, controller.method);
```

## 📄 Licença

ISC