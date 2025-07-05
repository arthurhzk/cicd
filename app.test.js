const request = require('supertest');
const app = require('./app');

describe('API Tests', () => {
  
  // Testes básicos
  describe('GET /', () => {
    test('deve retornar informações da API', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('API Node.js funcionando!');
      expect(response.body.version).toBe('1.0.0');
    });
  });

  describe('GET /health', () => {
    test('deve retornar status de saúde', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });

  // Testes de usuários
  describe('Users API', () => {
    let userId;

    test('POST /users - deve criar um novo usuário', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@email.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      
      userId = response.body.id;
    });

    test('POST /users - deve falhar com dados incompletos', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'João' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Nome e email são obrigatórios');
    });

    test('POST /users - deve falhar com email duplicado', async () => {
      const userData = {
        name: 'Maria Silva',
        email: 'joao@email.com'
      };

      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email já existe');
    });

    test('GET /users - deve listar todos os usuários', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /users/:id - deve buscar usuário por ID', async () => {
      const response = await request(app).get(`/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expect(response.body.name).toBe('João Silva');
    });

    test('GET /users/:id - deve retornar 404 para usuário inexistente', async () => {
      const response = await request(app).get('/users/inexistente');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('PUT /users/:id - deve atualizar usuário', async () => {
      const updateData = {
        name: 'João Santos',
        email: 'joao.santos@email.com'
      };

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.updatedAt).toBeDefined();
    });

    test('DELETE /users/:id - deve deletar usuário', async () => {
      const response = await request(app).delete(`/users/${userId}`);
      expect(response.status).toBe(204);
    });

    test('GET /users/:id - deve retornar 404 após deletar usuário', async () => {
      const response = await request(app).get(`/users/${userId}`);
      expect(response.status).toBe(404);
    });
  });

  // Testes de posts
  describe('Posts API', () => {
    let userId, postId;

    beforeAll(async () => {
      // Criar usuário para os testes de posts
      const userData = {
        name: 'Autor Test',
        email: 'autor@email.com'
      };

      const userResponse = await request(app)
        .post('/users')
        .send(userData);

      userId = userResponse.body.id;
    });

    test('POST /posts - deve criar um novo post', async () => {
      const postData = {
        title: 'Meu primeiro post',
        content: 'Este é o conteúdo do meu primeiro post',
        userId: userId
      };

      const response = await request(app)
        .post('/posts')
        .send(postData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(postData.title);
      expect(response.body.content).toBe(postData.content);
      expect(response.body.userId).toBe(userId);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      
      postId = response.body.id;
    });

    test('POST /posts - deve falhar com dados incompletos', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'Título sem conteúdo' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Título, conteúdo e userId são obrigatórios');
    });

    test('POST /posts - deve falhar com usuário inexistente', async () => {
      const postData = {
        title: 'Post inválido',
        content: 'Este post não deveria ser criado',
        userId: 'usuario-inexistente'
      };

      const response = await request(app)
        .post('/posts')
        .send(postData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Usuário não encontrado');
    });

    test('GET /posts - deve listar todos os posts', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /posts/:id - deve buscar post por ID', async () => {
      const response = await request(app).get(`/posts/${postId}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe('Meu primeiro post');
    });
  });

  // Testes de matemática
  describe('Math API', () => {
    test('GET /math/add/:a/:b - deve somar dois números', async () => {
      const response = await request(app).get('/math/add/5/3');
      expect(response.status).toBe(200);
      expect(response.body.operation).toBe('addition');
      expect(response.body.a).toBe(5);
      expect(response.body.b).toBe(3);
      expect(response.body.result).toBe(8);
    });

    test('GET /math/subtract/:a/:b - deve subtrair dois números', async () => {
      const response = await request(app).get('/math/subtract/10/4');
      expect(response.status).toBe(200);
      expect(response.body.operation).toBe('subtraction');
      expect(response.body.result).toBe(6);
    });

    test('GET /math/multiply/:a/:b - deve multiplicar dois números', async () => {
      const response = await request(app).get('/math/multiply/6/7');
      expect(response.status).toBe(200);
      expect(response.body.operation).toBe('multiplication');
      expect(response.body.result).toBe(42);
    });

    test('GET /math/divide/:a/:b - deve dividir dois números', async () => {
      const response = await request(app).get('/math/divide/15/3');
      expect(response.status).toBe(200);
      expect(response.body.operation).toBe('division');
      expect(response.body.result).toBe(5);
    });

    test('GET /math/divide/:a/:b - deve falhar com divisão por zero', async () => {
      const response = await request(app).get('/math/divide/10/0');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Divisão por zero não é permitida');
    });

    test('GET /math/add/:a/:b - deve falhar com valores inválidos', async () => {
      const response = await request(app).get('/math/add/abc/def');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valores devem ser números');
    });

    test('POST /math/calculate - deve calcular múltiplas operações', async () => {
      const operations = [
        { operation: 'add', a: 5, b: 3 },
        { operation: 'multiply', a: 4, b: 6 },
        { operation: 'subtract', a: 10, b: 2 }
      ];

      const response = await request(app)
        .post('/math/calculate')
        .send({ operations });

      expect(response.status).toBe(200);
      expect(response.body.results).toHaveLength(3);
      expect(response.body.results[0].result).toBe(8);
      expect(response.body.results[1].result).toBe(24);
      expect(response.body.results[2].result).toBe(8);
    });
  });

  // Testes de utilitários
  describe('Utility API', () => {
    test('GET /random/number - deve gerar número aleatório', async () => {
      const response = await request(app).get('/random/number');
      expect(response.status).toBe(200);
      expect(response.body.number).toBeDefined();
      expect(response.body.min).toBe(0);
      expect(response.body.max).toBe(100);
      expect(response.body.timestamp).toBeDefined();
    });

    test('GET /random/number - deve gerar número aleatório com range customizado', async () => {
      const response = await request(app).get('/random/number?min=50&max=60');
      expect(response.status).toBe(200);
      expect(response.body.number).toBeGreaterThanOrEqual(50);
      expect(response.body.number).toBeLessThanOrEqual(60);
      expect(response.body.min).toBe(50);
      expect(response.body.max).toBe(60);
    });

    test('GET /server/info - deve retornar informações do servidor', async () => {
      const response = await request(app).get('/server/info');
      expect(response.status).toBe(200);
      expect(response.body.nodeVersion).toBeDefined();
      expect(response.body.platform).toBeDefined();
      expect(response.body.uptime).toBeDefined();
      expect(response.body.memoryUsage).toBeDefined();
      expect(response.body.timestamp).toBeDefined();
    });
  });

  // Teste de rota não encontrada
  describe('404 Handler', () => {
    test('deve retornar 404 para rota inexistente', async () => {
      const response = await request(app).get('/rota-inexistente');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Rota não encontrada');
    });
  });
});