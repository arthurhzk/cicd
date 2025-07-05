const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Banco de dados em memória
let users = [];
let posts = [];

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Node.js funcionando!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/users',
      posts: '/posts',
      math: '/math/*'
    }
  });
});

// === ROTAS DE USUÁRIOS ===

// Listar todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Buscar usuário por ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  res.json(user);
});

// Criar novo usuário
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'Email já existe' });
  }
  
  const user = {
    id: uuidv4(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  res.status(201).json(user);
});

// Atualizar usuário
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  if (email && users.some(u => u.email === email && u.id !== req.params.id)) {
    return res.status(400).json({ error: 'Email já existe' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    updatedAt: new Date().toISOString()
  };
  
  res.json(users[userIndex]);
});

// Deletar usuário
app.delete('/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// === ROTAS DE POSTS ===

// Listar todos os posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// Buscar post por ID
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  res.json(post);
});

// Criar novo post
app.post('/posts', (req, res) => {
  const { title, content, userId } = req.body;
  
  if (!title || !content || !userId) {
    return res.status(400).json({ error: 'Título, conteúdo e userId são obrigatórios' });
  }
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado' });
  }
  
  const post = {
    id: uuidv4(),
    title,
    content,
    userId,
    createdAt: new Date().toISOString()
  };
  
  posts.push(post);
  res.status(201).json(post);
});

// === ROTAS DE MATEMÁTICA ===

// Operações matemáticas básicas
app.get('/math/add/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Valores devem ser números' });
  }
  
  res.json({ 
    operation: 'addition',
    a, b,
    result: a + b 
  });
});

app.get('/math/subtract/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Valores devem ser números' });
  }
  
  res.json({ 
    operation: 'subtraction',
    a, b,
    result: a - b 
  });
});

app.get('/math/multiply/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Valores devem ser números' });
  }
  
  res.json({ 
    operation: 'multiplication',
    a, b,
    result: a * b 
  });
});

app.get('/math/divide/:a/:b', (req, res) => {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: 'Valores devem ser números' });
  }
  
  if (b === 0) {
    return res.status(400).json({ error: 'Divisão por zero não é permitida' });
  }
  
  res.json({ 
    operation: 'division',
    a, b,
    result: a / b 
  });
});

// Rota para calcular múltiplas operações
app.post('/math/calculate', (req, res) => {
  const { operations } = req.body;
  
  if (!Array.isArray(operations)) {
    return res.status(400).json({ error: 'Operations deve ser um array' });
  }
  
  const results = operations.map(op => {
    const { operation, a, b } = op;
    
    if (isNaN(a) || isNaN(b)) {
      return { error: 'Valores devem ser números', operation: op };
    }
    
    switch (operation) {
      case 'add':
        return { operation, a, b, result: a + b };
      case 'subtract':
        return { operation, a, b, result: a - b };
      case 'multiply':
        return { operation, a, b, result: a * b };
      case 'divide':
        if (b === 0) {
          return { error: 'Divisão por zero', operation: op };
        }
        return { operation, a, b, result: a / b };
      default:
        return { error: 'Operação não suportada', operation: op };
    }
  });
  
  res.json({ results });
});

// === ROTAS DE UTILITÁRIOS ===

// Gerar dados aleatórios
app.get('/random/number', (req, res) => {
  const min = parseInt(req.query.min) || 0;
  const max = parseInt(req.query.max) || 100;
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  
  res.json({ 
    number: random,
    min,
    max,
    timestamp: new Date().toISOString()
  });
});

// Informações do servidor
app.get('/server/info', (req, res) => {
  res.json({
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor apenas se não estiver sendo importado para testes
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;