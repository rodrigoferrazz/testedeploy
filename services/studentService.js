// services/studentService.js

// Import the database connection
const db = require('../config/db');
const Student = require('../models/studentModel');

// Function to get all students
const getAllStudents = async () => {
  try {
    return await Student.getAll();
  } catch (error) {
    throw new Error('Error retrieving students:' + error.message);
  }
};

// Function to get a student by ID
const getStudentById = async (id) => {
  try {
    return await Student.getById(id);
  } catch (error) {
    throw new Error('Error retrieving student:' + error.message);
  }
};

// Function to create a new student
const createStudent = async (name, email) => {
  try {
    return await Student.create({ name, email });
  } catch (error) {
    throw new Error('Error creating student:' + error.message);
  }
};

// Function to update a student by ID
const updateStudent = async (id, name, email) => {
  try {
    return await Student.update(id, { name, email });
  } catch (error) {
    throw new Error('Error updating student:' + error.message);
  }
};

// Function to delete a student by ID
const deleteStudent = async (id) => {
  try {
    return await Student.delete(id);
  } catch (error) {
    throw new Error('Error deleting student:' + error.message);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};