const studentService = require('../services/studentService');
const db = require('../config/db');

jest.mock('../config/db'); // Mock do banco de dados

describe('studentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllStudents deve retornar todos os estudantes com sucesso', async () => {
    // Arrange: Mock DB to return students
    const mockStudents = [
      { id: 1, name: 'João Silva', email: 'joao@email.com' },
      { id: 2, name: 'Maria Santos', email: 'maria@email.com' }
    ];
    db.query.mockResolvedValue({ rows: mockStudents });

    // Act: Call getAllStudents
    const result = await studentService.getAllStudents();

    // Assert: Check result and DB call
    expect(result).toEqual(mockStudents);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM students');
  });

  test('getAllStudents deve lançar erro em falha de banco', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Database error'));

    // Act & Assert: Should throw
    await expect(studentService.getAllStudents()).rejects.toThrow('Error retrieving students:Database error');
  });

  test('getStudentById deve retornar um estudante específico com sucesso', async () => {
    // Arrange: Mock DB to return a student
    const studentId = 1;
    const mockStudent = { id: studentId, name: 'João Silva', email: 'joao@email.com' };
    db.query.mockResolvedValue({ rows: [mockStudent] });

    // Act: Call getStudentById
    const result = await studentService.getStudentById(studentId);

    // Assert: Check result and DB call
    expect(result).toEqual(mockStudent);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM students WHERE id = $1', [studentId]);
  });

  test('getStudentById deve lançar erro em falha de banco', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Database error'));

    // Act & Assert: Should throw
    await expect(studentService.getStudentById(1)).rejects.toThrow('Error retrieving student:Database error');
  });

  test('createStudent deve criar um novo estudante com sucesso', async () => {
    // Arrange: Mock DB to return created student
    const name = 'João Silva';
    const email = 'joao@email.com';
    const createdStudent = { id: 1, name, email };
    db.query.mockResolvedValue({ rows: [createdStudent] });

    // Act: Call createStudent
    const result = await studentService.createStudent(name, email);

    // Assert: Check result and DB call
    expect(result).toEqual(createdStudent);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
  });

  test('createStudent deve lançar erro em falha de criação', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Creation error'));

    // Act & Assert: Should throw
    await expect(studentService.createStudent('João', 'joao@email.com')).rejects.toThrow('Error creating student:Creation error');
  });

  test('updateStudent deve atualizar um estudante com sucesso', async () => {
    // Arrange: Mock DB to return updated student
    const id = 1;
    const name = 'João Atualizado';
    const email = 'joao.novo@email.com';
    const updatedStudent = { id, name, email };
    db.query.mockResolvedValue({ rows: [updatedStudent] });

    // Act: Call updateStudent
    const result = await studentService.updateStudent(id, name, email);

    // Assert: Check result and DB call
    expect(result).toEqual(updatedStudent);
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
  });

  test('updateStudent deve lançar erro em falha de atualização', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Update error'));

    // Act & Assert: Should throw
    await expect(studentService.updateStudent(1, 'João', 'joao@email.com')).rejects.toThrow('Error updating student:Update error');
  });

test('deleteStudent deve deletar um estudante com sucesso', async () => {
  const id = 1;
  const deletedStudent = { id, name: 'João Silva', email: 'joao@email.com' };
  db.query.mockResolvedValue({ rows: [deletedStudent] });

  const result = await studentService.deleteStudent(id);

  expect(result).toEqual(deletedStudent);
  expect(db.query).toHaveBeenCalledWith('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
});

  test('deleteStudent deve lançar erro em falha de exclusão', async () => {
    // Arrange: Mock DB to throw error
    db.query.mockRejectedValue(new Error('Deletion error'));

    // Act & Assert: Should throw
    await expect(studentService.deleteStudent(1)).rejects.toThrow('Error deleting student:Deletion error');
  });
});