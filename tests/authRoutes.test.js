const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const authController = require('../controllers/authController');

// mocks the authController
jest.mock('../controllers/authController');

describe('authRoutes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.urlencoded({ extended: false }));
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/../views'); 
    app.use('/', authRoutes);
  });

  test('GET /login should render login page with null error', async () => {
    // Arrange: No special setup needed

    // Act: Make GET request to /login
    const res = await request(app).get('/login');

    // Assert: Check response status and content
    expect(res.status).toBe(200);
    expect(res.text).toContain('<'); // Verifica se retornou HTML (ajuste conforme o conteúdo da view)
  });

  test('POST /login should call authController.login', async () => {
    // Arrange: Mock the login implementation
    authController.login.mockImplementation((req, res) => {
      res.send('login called');
    });

    // Act: Make POST request to /login
    const res = await request(app)
      .post('/login')
      .send({ email_guardians: 'test@email.com', password_guardians: '123456' });

    // Assert: Check that controller was called and response is as expected
    expect(authController.login).toHaveBeenCalled();
    expect(res.text).toBe('login called');
  });
});