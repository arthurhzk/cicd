# Simple Node.js API

Uma API RESTful simples construída com Node.js e Express, com funcionalidades variadas para demonstrar diferentes aspectos do desenvolvimento backend.

## 🚀 Funcionalidades

- **CRUD de Usuários**: Criar, listar, atualizar e deletar usuários
- **Sistema de Posts**: Criar e listar posts associados a usuários
- **Operações Matemáticas**: Endpoints para cálculos básicos
- **Utilitários**: Geração de números aleatórios e informações do servidor
- **Health Check**: Endpoint para verificar status da aplicação

## 📋 Pré-requisitos

- Node.js 14.0.0 ou superior
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd simple-node-api
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie a aplicação:
```bash
npm start
```

A API estará rodando em `http://localhost:3000`

## 🧪 Testes

Execute os testes:
```bash
npm test
```

Execute os testes com coverage:
```bash
npm run test:coverage
```

Execute os testes em modo watch:
```bash
npm run test:watch
```

## 📚 Documentação da API

### Endpoints Principais

#### Health Check
- `GET /health` - Verifica se a API está funcionando

#### Root
- `GET /` - Informações da API e endpoints disponíveis

#### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Deleta usuário

#### Posts
- `GET /posts` - Lista todos os posts
- `GET /posts/:id` - Busca post por ID
- `POST /posts` - Cria novo post

#### Matemática
- `GET /math/add/:a/:b` - Soma dois números
- `GET /math/subtract/:a/:b` - Subtrai dois números
- `GET /math/multiply/:a/:b` - Multiplica dois números
- `GET /math/divide/:a/:b` - Divide dois números
- `POST /math/calculate` - Calcula múltiplas operações

#### Utilitários
- `GET /random/number` - Gera número aleatório
- `GET /server/info` - Informações do servidor

### Exemplos de Uso

#### Criar um usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@email.com"}'
```

#### Fazer cálculos matemáticos
```bash
curl http://localhost:3000/math/add/5/3
```

#### Criar um post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Meu Post","content":"Conteúdo do post","userId":"user-id-here"}'
```

## 🔧 Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 🐳 Docker

Para rodar com Docker:

1. Construa a imagem:
```bash
docker build -t simple-node-api .
```

2. Execute o container:
```bash
docker run -p 3000:3000 simple-node-api
```

## 🔄 CI/CD

O projeto inclui um pipeline completo do GitHub Actions que executa:

- ✅ Testes em múltiplas versões do Node.js (16, 18, 20)
- 🔍 Análise de qualidade de código
- 🔒 Verificações de segurança
- 🚀 Testes de performance
- 🐳 Build e teste de containers Docker
- 📦 Deploy condicional
- 📢 Notificações

O pipeline é executado automaticamente em:
- Push para branches `main` e `develop`
- Pull requests para `main` e `develop`  
- Agendamento semanal (segundas-feiras às 9h)

## 📊 Cobertura de Testes

Os testes cobrem:
- Todos os endpoints da API
- Validações de entrada
- Tratamento de erros
- Casos de sucesso e falha
- Operações CRUD completas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:
- Abra uma issue no GitHub
- Verifique a documentação
- Execute os testes para verificar se tudo está funcionando

## 📈 Roadmap

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Paginação
- [ ] Logs estruturados
- [ ] Documentação OpenAPI/Swagger
- [ ] Cache com Redis
- [ ] Banco de dados real (PostgreSQL/MongoDB)