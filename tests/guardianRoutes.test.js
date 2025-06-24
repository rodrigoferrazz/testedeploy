const request = require('supertest'); 
const express = require('express'); 
const guardianRoutes = require('../routes/guardianRoutes'); 
const db = require('../config/db'); 


const app = express();
app.use(express.json()); 
app.use('/guardians', guardianRoutes); 

jest.mock('../config/db'); 

describe('Guardian Routes', () => {


  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /guardians/:guardianId/pi deve retornar dados do responsável', async () => {
    // Arrange: Mock DB to return a guardian
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Maria Silva', email: 'maria@email.com' }]
    });

    // Act: Make GET request
    const res = await request(app).get('/guardians/api/guardians/1/pi');

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Maria Silva', email: 'maria@email.com' });
  });

  test('GET /guardians/:guardianId/pi deve retornar 404 se responsável não for encontrado', async () => {
    // Arrange: Mock DB to return empty
    db.query.mockResolvedValue({ rows: [] });

    // Act: Make GET request
    const res = await request(app).get('/guardians/api/guardians/999/pi');

    // Assert: Check response
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Guardian not found' });
  });

  test('GET /guardians/:guardianId/pi deve retornar 500 em erro de servidor', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Falha no banco'));

    // Act: Make GET request
    const res = await request(app).get('/guardians/api/guardians/1/pi');

    // Assert: Check response
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno no servidor' });
  });

  test('POST /guardians deve criar um novo responsável', async () => {
    // Arrange: Mock DB to return new guardian
    db.query.mockResolvedValue({
      rows: [{ id: 2, name: 'João Santos', email: 'joao@email.com' }]
    });

    // Act: Make POST request
    const res = await request(app).post('/guardians').send({
      name: 'João Santos',
      email: 'joao@email.com'
    });

    // Assert: Check response
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, name: 'João Santos', email: 'joao@email.com' });
  });

  test('PUT /guardians/:id deve atualizar os dados do responsável', async () => {
    // Arrange: Mock DB to return updated guardian
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Maria Silva Atualizada', email: 'nova@email.com' }]
    });

    // Act: Make PUT request
    const res = await request(app).put('/guardians/1').send({
      name: 'Maria Silva Atualizada',
      email: 'nova@email.com'
    });

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'Maria Silva Atualizada', email: 'nova@email.com' });
  });

  test('DELETE /guardians/:id deve deletar o responsável', async () => {
    // Arrange: Mock DB to simulate successful deletion
    db.query.mockResolvedValue({ rowCount: 1 });

    // Act: Make DELETE request
    const res = await request(app).delete('/guardians/1');

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Responsável deletado' });
  });

  test('DELETE /guardians/:id deve retornar 404 se não encontrar o responsável', async () => {
    // Arrange: Mock DB to simulate not found
    db.query.mockResolvedValue({ rowCount: 0 });

    // Act: Make DELETE request
    const res = await request(app).delete('/guardians/999');

    // Assert: Check response
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Responsável não encontrado' });
  });
});




