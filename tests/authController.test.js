const authController = require('../controllers/authController');
const db = require('../config/db');

// mocking the database
jest.mock('../config/db');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    // Arrange: Set up mock request and response objects
    req = {
      body: {
        email_guardians: 'test@email.com',
        password_guardians: '123456'
      }
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn()
    };
  });

  test('login should redirect on successful login', async () => {
    // Arrange: Mock DB to return a guardian with id 42
    db.query.mockResolvedValueOnce({ rows: [{ id: 42 }] });

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Check DB query and redirect call
    expect(db.query).toHaveBeenCalledWith(
      `SELECT id, email_guardians, password_guardians, change_password\n       FROM guardians\n       WHERE email_guardians = $1\n         AND password_guardians = $2`,
      ['test@email.com', '123456']
    );
    expect(res.redirect).toHaveBeenCalledWith('/students/guardians/42/students');
  });

  test('login should render login page with error if credentials are invalid', async () => {
    // Arrange: Mock DB to return no users
    db.query.mockResolvedValueOnce({ rows: [] });

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Should render login page with error
    expect(res.render).toHaveBeenCalledWith('login/index', { error: 'You’ve entered an incorrect email address or password.' });
  });

  test('login should render login page with error if db throws', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValueOnce(new Error('DB error'));

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Should render login page with authentication error
    expect(res.render).toHaveBeenCalledWith('login/index', { error: 'An error occurred during authentication. Please try again.' });
  });

  test('login should render error if email_guardians is missing', async () => {
    // Arrange: Remove email from request
    req.body.email_guardians = '';
    req.body.password_guardians = '123456';

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Should render login page with error
    expect(res.render).toHaveBeenCalledWith('login/index', { error: 'You’ve entered an incorrect email address or password.' });
  });

  test('login should render error if password_guardians is missing', async () => {
    // Arrange: Remove password from request
    req.body.email_guardians = 'test@email.com';
    req.body.password_guardians = '';

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Should render login page with error
    expect(res.render).toHaveBeenCalledWith('login/index', { error: 'You’ve entered an incorrect email address or password.' });
  });

  test('login should render error if both email_guardians and password_guardians are missing', async () => {
    // Arrange: Remove both email and password from request
    req.body.email_guardians = '';
    req.body.password_guardians = '';

    // Act: Call the login method
    await authController.login(req, res);

    // Assert: Should render login page with error
    expect(res.render).toHaveBeenCalledWith('login/index', { error: 'You’ve entered an incorrect email address or password.' });
  });
});
