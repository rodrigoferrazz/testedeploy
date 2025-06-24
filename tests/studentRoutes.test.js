const request = require('supertest');
const express = require('express');
const studentRoutes = require('../routes/studentRoutes');
const db = require('../config/db');

const app = express();
app.use(express.json());
app.use('/students', studentRoutes);

jest.mock('../config/db');

describe('student Routes', () => {
  test('GET /students must return all of the students', async () => {
    // Arrange: Mock DB to return students
    db.query.mockResolvedValue({ rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }] });

    // Act: Make GET request
    const res = await request(app).get('/students');

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'John Doe', email: 'john@example.com' }]);
  });

  test('GET /students/:id must return a student by their id', async () => {
    // Arrange: Mock DB to return a student
    db.query.mockResolvedValue({ rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }] });

    // Act: Make GET request
    const res = await request(app).get('/students/1');

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  test('POST /students must create a new student', async () => {
    // Arrange: Mock DB to return created student
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }],
    });

    // Act: Make POST request
    const res = await request(app).post('/students').send({ name: 'John Doe', email: 'john@example.com' });

    // Assert: Check response
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  test('PUT /students/:id must update a student', async () => {
    // Arrange: Mock DB to return updated student
    db.query.mockResolvedValue({
      rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }],
    });

    // Act: Make PUT request
    const res = await request(app).put('/students/1').send({ name: 'John Doe', email: 'john@example.com' });

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  test('DELETE /students/:id must delete a student', async () => {
    // Arrange: Mock DB to simulate successful deletion
db.query.mockResolvedValue({ rows: [{ id: 1, name: 'John Doe', email: 'john@example.com' }] });

    // Act: Make DELETE request
    const res = await request(app).delete('/students/1');

    // Assert: Check response
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Student deleted' });
  });
});