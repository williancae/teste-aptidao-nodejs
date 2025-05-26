## 📦 Instalação

### Pré-requisitos

- Node.js 20+
- Docker & Docker Compose
- Git

### 1. Clone o repositório

```sh
git clone https://github.com/williancae/teste-aptidao-brain.git
cd teste-aptidao-brain
```

### 2. Instale as dependências

```sh
npm install
```

### 3. Configure as variáveis de ambiente

```sh
cp .env.example .env
```

### 4. Executando Aplicação

```sh
# Iniciar PostgreSQL e Redis
docker-compose up -d postgres redis

# Rodar API
npm run start:dev
```

### 5. Executando Seeds

| fazer essa etapa depois de rodar a API

```sh
npm run seed:run
```

## 🔗 API

### Base URL

```sh
http://localhost:3000/api
```

### Documentação Swagger

```sh
http://localhost:3000/api/docs
```
