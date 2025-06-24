const db = require('../config/db');
const Student = require('../models/studentModel.js');

jest.mock('../config/db');

describe('Student Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('Return an array of students', async () => {
      // Arrange: Mock DB to return students
      const mockStudents = [{ id: 1, name: 'João', email: 'joao@email.com' }, { id: 2, name: 'Maria', email: 'maria@email.com' }];
      db.query.mockResolvedValue({ rows: mockStudents });

      // Act: Call getAll
      const result = await Student.getAll();

      // Assert: Check DB call and result
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM students');
      expect(result).toEqual(mockStudents);
    });

    it('Throw an error if the query fails', async () => {
      // Arrange: Mock DB to throw error
      db.query.mockRejectedValue(new Error('DB failure'));

      // Act & Assert: Should throw
      await expect(Student.getAll()).rejects.toThrow('DB failure');
    });
  });

  describe('getById', () => {
    it('Return the student found by id', async () => {
      // Arrange: Mock DB to return a student
      const mockStudent = { id: 1, name: 'João', email: 'joao@email.com' };
      db.query.mockResolvedValue({ rows: [mockStudent] });

      // Act: Call getById
      const result = await Student.getById(1);

      // Assert: Check DB call and result
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM students WHERE id = $1', [1]);
      expect(result).toEqual(mockStudent);
    });

    it('Return null if no student is found', async () => {
      // Arrange: Mock DB to return empty
      db.query.mockResolvedValue({ rows: [] });

      // Act: Call getById
      const result = await Student.getById(999);

      // Assert: Should be null
      expect(result).toBeNull();
    });

    it('Throw an error if the query fails', async () => {
      // Arrange: Mock DB to throw error
      db.query.mockRejectedValue(new Error('DB failure'));

      // Act & Assert: Should throw
      await expect(Student.getById(1)).rejects.toThrow('DB failure');
    });
  });

  describe('create', () => {
    const inputData = {
      name: 'João',
      email: 'joao@email.com'
    };

    it('Create a student and return the created object', async () => {
      // Arrange: Mock DB to return created student
      db.query.mockResolvedValue({ rows: [inputData] });

      // Act: Call create
      const result = await Student.create(inputData);

      // Assert: Check DB call and result
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
        [inputData.name, inputData.email]
      );
      expect(result).toEqual(inputData);
    });

    it('Throw an error if the query fails', async () => {
      // Arrange: Mock DB to throw error
      db.query.mockRejectedValue(new Error('DB failure'));

      // Act & Assert: Should throw
      await expect(Student.create(inputData)).rejects.toThrow('DB failure');
    });
  });

  describe('update', () => {
    const updatedData = {
      name: 'João Atualizado',
      email: 'joao_atualizado@email.com'
    };

    it('Update a student and return the updated object', async () => {
      // Arrange: Mock DB to return updated student
      db.query.mockResolvedValue({ rows: [updatedData] });

      // Act: Call update
      const result = await Student.update(1, updatedData);

      // Assert: Check DB call and result
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
        [updatedData.name, updatedData.email, 1]
      );
      expect(result).toEqual(updatedData);
    });

    it('Return null if no student is found to update', async () => {
      // Arrange: Mock DB to return empty
      db.query.mockResolvedValue({ rows: [] });

      // Act: Call update
      const result = await Student.update(999, updatedData);

      // Assert: Should be null
      expect(result).toBeNull();
    });

    it('Throw an error if the query fails', async () => {
      // Arrange: Mock DB to throw error
      db.query.mockRejectedValue(new Error('DB failure'));

      // Act & Assert: Should throw
      await expect(Student.update(1, updatedData)).rejects.toThrow('DB failure');
    });
  });

describe('delete', () => {
  it('Delete a student and return the deleted object', async () => {
    // arrange
    const deletedStudent = { id: 1, name: 'João', email: 'joao@email.com' };
    db.query.mockResolvedValue({ rows: [deletedStudent] });

    // act
    const result = await Student.delete(1);

    // assert
    expect(db.query).toHaveBeenCalledWith('DELETE FROM students WHERE id = $1 RETURNING *', [1]);
    expect(result).toEqual(deletedStudent);
  });

  it('Return null if no student was found to delete', async () => {
    // arrange
    db.query.mockResolvedValue({ rows: [] });

    const result = await Student.delete(999);

    expect(result).toBeNull();
  });

  it('Throw an error if the query fails', async () => {
    db.query.mockRejectedValue(new Error('DB failure'));
    await expect(Student.delete(1)).rejects.toThrow('DB failure');
  });
});
});