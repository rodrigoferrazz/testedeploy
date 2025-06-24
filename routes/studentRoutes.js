const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Endpoint to list all students (returns JSON)
router.get('/', studentController.getAllStudents);

// Endpoint to list all students for a specific guardian (renders children selection page)
router.get('/guardians/:guardianId/students', studentController.getStudentsByGuardian);

// Endpoint to render the about page for a student
router.get('/:studentId/about', studentController.renderStudentAbout);

// Endpoint to get a specific student by ID (returns JSON)
router.get('/:id', studentController.getStudentById);

// Endpoint to render the student's home page
router.get('/:studentId/home', studentController.renderStudentHome);

// Endpoint to create a new student (API)
router.post('/', studentController.createStudent);

// Endpoint to update a student (API)
router.put('/:id', studentController.updateStudent);

// Endpoint to render a view with the list of students
router.get('/view', studentController.renderAllStudents);

// Endpoint to delete a student (API)
router.delete('/:id', studentController.deleteStudent);

// Endpoint to render the student's reports page
router.get('/:studentId/reports', studentController.renderStudentReports);

// Endpoint to render the student's timetable page
router.get('/:studentId/timetable', studentController.renderStudentTimetable);

module.exports = router;