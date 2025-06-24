const db = require('../config/db');

// Student model with static methods for database operations
class Student {
  // Get all students from the database
  static async getAll() {
    const result = await db.query('SELECT * FROM students');
    return result.rows;
  }

  // Get a student by ID
  static async getById(id) {
    const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  // Create a new student
  static async create(data) {
    const result = await db.query(
      'INSERT INTO students (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email]
    );
    return result.rows[0];
  }

  // Update a student by ID
  static async update(id, data) {
    const result = await db.query(
      'UPDATE students SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [data.name, data.email, id]
    );
    return result.rows[0] || null;
  }

  // Delete a student by ID
  static async delete(id) {
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
  return result.rows && result.rows[0] ? result.rows[0] : null;
  }
}

module.exports = Student;