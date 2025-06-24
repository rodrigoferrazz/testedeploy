const studentController = require('../controllers/studentController');
const studentService = require('../services/studentService');

// Mocks all of the studentService
jest.mock('../services/studentService');

describe('studentController', () => {
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      render: jest.fn(),
    };
  });

  test('getAllStudents must return all students', async () => {
    // arrange: here, the background for the test is being built. mock students are created and given parameters,
    // so that the getAllStudents method can be called to check them.
    const mockStudents = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
    ];
    studentService.getAllStudents.mockResolvedValueOnce(mockStudents);

    // act: the method is actively being called here to check if the code is able to get all the students properly.
    await studentController.getAllStudents(req, res);

    // assert: here the results of the test can be visualized. the status "200" states the test was successful.
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudents);
  });
  
  test('getAllStudents should handle errors and send 500', async () => {
  // arrange: mocks the method getAllStudents simulating an error
  studentService.getAllStudents.mockRejectedValueOnce(new Error('DB error'));

  // act: the method is actively being called here to check if the controller method is called (in this case, using the 'catch' conditional).
  await studentController.getAllStudents(req, res);

  // assert: here the results of the test can be visualized. the status "500" states an internal error loading the students.
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
  });

  test('getStudentById must return the right student', async () => {
    // arrange: mock students are being created so that the req can take the id as a parameter to check if the
    // method is properly getting the student by their id.
    const mockStudent = { id: '1', name: 'John Doe', email: 'john@example.com' };
    req.params = { id: '1' };
    studentService.getStudentById.mockResolvedValueOnce(mockStudent);
    
    // act: the method is actively being called here to check if the code is able to get all the students by their ids properly.
    await studentController.getStudentById(req, res);

    // assert: here the results of the test can be visualized. the status "200" states the test was successful.
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockStudent);
  });

  test('getStudentById should return 404 if student not found', async () => {
  // arrange: mocks the method getStudentById simulating an error
  req.params = { id: '999' };
  studentService.getStudentById.mockResolvedValueOnce(null);

  // act: the method is actively being called here to check if the code is able to get all students by their ids.
  await studentController.getStudentById(req, res);

  // assert: here the results of the test can be visualized. the status "404" states an error founding the students.
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });
  
test('getStudentById should handle errors and send 500', async () => {
  req.params = { id: '1' };
  studentService.getStudentById.mockRejectedValueOnce(new Error('DB error'));

  await studentController.getStudentById(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
});


  test('createStudent must create a new student', async () => {
    // arrange: mock students are being created.
    const newStudent = { id: '1', name: 'John Doe', email: 'john@example.com' };
    req.body = { name: 'John Doe', email: 'john@example.com' };
    studentService.createStudent.mockResolvedValueOnce(newStudent);

    // act: the method is actively being called here to check if the code is able to create new students.
    await studentController.createStudent(req, res);

    // assert: here the results of the test can be visualized. the status "201" states the test was successful.
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newStudent);
  });

  test('createStudent should handle errors and send 500', async () => {
  req.body = { name: 'John Doe', email: 'john@example.com' };
  studentService.createStudent.mockRejectedValueOnce(new Error('DB error'));

  await studentController.createStudent(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
});

  test('updateStudent must update a student', async () => {
    // arrange: mock students are being updated.
    const updatedStudent = { id: '1', name: 'John Doe', email: 'john_updated@example.com' };
    req.params = { id: '1' };
    req.body = { name: 'John Doe', email: 'john_updated@example.com' };
    studentService.updateStudent.mockResolvedValueOnce(updatedStudent);

    // act: the method is actively being called here to check if the code is able to update students.
    await studentController.updateStudent(req, res);

    // assert: here the results of the test can be visualized. the status "200" states the test was successful.
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedStudent);
  });

  test('updateStudent should return 404 if student is not able to be updated', async () => {
  req.params = { id: '999' };
  req.body = { name: 'John Doe', email: 'john@example.com' };
  studentService.updateStudent.mockResolvedValueOnce(null);

  await studentController.updateStudent(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
});

  
  test('updateStudent should handle errors and send 500', async () => {
  req.params = { id: '1' };
  req.body = { name: 'John Doe', email: 'john@example.com' };
  studentService.updateStudent.mockRejectedValueOnce(new Error('DB error'));

  await studentController.updateStudent(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
});

describe('deleteStudent', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: '1' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should delete student successfully', async () => {
    studentService.deleteStudent.mockResolvedValue(true); // simula sucesso

    await studentController.deleteStudent(req, res);

    expect(studentService.deleteStudent).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Student deleted' });
  });

  test('should return 404 if student not found', async () => {
    studentService.deleteStudent.mockResolvedValue(null); // simula não encontrado

    await studentController.deleteStudent(req, res);

    expect(studentService.deleteStudent).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Student not found' });
  });
})

  test('should handle errors and send 500', async () => {
    // Make sure req has the id parameter properly set
    req = { params: { id: '1' } };
    
    // Mock the deleteStudent method to reject with an error
    studentService.deleteStudent = jest.fn().mockRejectedValue(new Error('DB error'));

    await studentController.deleteStudent(req, res);

    expect(studentService.deleteStudent).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
  });

  test('renderAllStudents should render the students/index view with all students', async () => {
    // arrange: mocks the getAllStudents method from studentService to return mockStudents
  const mockStudents = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ];
  studentService.getAllStudents.mockResolvedValueOnce(mockStudents);

  // act: the method is actively being called here to check if the code is able to render all of the students.
  await studentController.renderAllStudents(req, res);

  // assert: here the results of the test can be visualized. the test is successful if the view (students/index) can render all of the students.
  // this test does not expects a status like the others above.
  expect(studentService.getAllStudents).toHaveBeenCalled();
  expect(res.render).toHaveBeenCalledWith('students/index', { students: mockStudents });
  });

  test('renderAllStudents should handle errors and send 500', async () => {
  studentService.getAllStudents.mockRejectedValueOnce(new Error('DB error'));
  await studentController.renderAllStudents(req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading students');
  });

 test('renderStudentHome should render the students/home view properly', async () => {
  // arrange: mock students are being created.
  req.params = { studentId: '1' };
  const mockStudent = { id: '1', name: 'John Doe', student_photo: 'photo.jpg' };
  const mockGuardianId = 10;

  // mocking student service
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  // mocking storage service
  const mockSignedUrl = 'https://storage.com/photo.jpg';
  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest.fn().mockResolvedValueOnce(mockSignedUrl);

  // mocking the database
  const db = require('../config/db');
  db.query = jest.fn().mockResolvedValueOnce({ rows: [{ id: mockGuardianId }] });

  // mocking the render method
  res.render = jest.fn();

  // act: the method is actively being called here to check if the code is able to render the homepage.
  await studentController.renderStudentHome(req, res);

  // assert: here the results of the test can be visualized. the test is successful if the view (students/home) is rendered.
  expect(studentService.getStudentById).toHaveBeenCalledWith('1');
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo.jpg');
  expect(db.query).toHaveBeenCalledWith(
    'SELECT id FROM guardians WHERE fk_students_id = $1',
    [mockStudent.id]
  );
  expect(res.render).toHaveBeenCalledWith('students/home', {
    student: { ...mockStudent, signed_photo_url: mockSignedUrl },
    guardianId: mockGuardianId
  });
  });

  test('renderStudentHome should handle errors and send 500', async () => {
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  await studentController.renderStudentHome(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading student page');
  });

  test('renderStudentHome should return 404 if the student cannot be found', async () => {
  // arrange: simulates student not found.
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(null);
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act: the method is actively being called here to check if the code is able to render the homepage.
  await studentController.renderStudentHome(req, res);

  // assert: here the results of the test can be visualized. the status "404" states an error founding the students.
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Student not found');
  });

 test('renderStudentAbout should render the students/about view properly', async () => {
  // arrange: mock parameters are being created.
  req.params = { studentId: '1' };
  const mockStudent = {
    id: '1',
    name: 'John Doe',
    email: 'john@email.com',
    academic_year: 2,
    birthday: 28/10/2006,
    houses: 3,
    tutors: 4
  };
  const mockGuardianId = 10;
  const mockForm = 'U6 T(S)';
  const mockHouseName = 'Lancaster';
  const mockTeachers = [{ id: 1, name: 'Teacher 1' }, { id: 2, name: 'Teacher 2' }];
  const mockTutor = { id: 4, name: 'Tutor 1' };

  // mocking student service
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  // mocking the database
  const db = require('../config/db');
  db.query = jest
    .fn()
    // guardianId
    .mockResolvedValueOnce({ rows: [{ id: mockGuardianId }] })
    // academic_year (form)
    .mockResolvedValueOnce({ rows: [{ form: mockForm }] })
    // academic_year (year_code)
    .mockResolvedValueOnce({ rows: [{ year_code: '2025A' }] })
    // house
    .mockResolvedValueOnce({ rows: [{ house_name: mockHouseName }] })
    // teachers
    .mockResolvedValueOnce({ rows: mockTeachers })
    // tutor
    .mockResolvedValueOnce({ rows: [mockTutor] });

  // mocking storageService
  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest.fn().mockResolvedValue('signed-photo-url');

  // act: the method is actively being called here to check if the code is able to render the about.
  await studentController.renderStudentAbout(req, res);

  // assert: here the results of the test can be visualized. the test is successful if the view (students/about) is rendered.
  expect(studentService.getStudentById).toHaveBeenCalledWith('1');
  expect(db.query).toHaveBeenCalledTimes(6);
  expect(res.render).toHaveBeenCalledWith('students/about', {
    student: { ...mockStudent, signed_photo_url: 'signed-photo-url' },
    form: mockForm,
    year_code: '2025A',
    houseName: mockHouseName,
    teachers: mockTeachers,
    tutor: mockTutor,
    guardianId: mockGuardianId,
    activePage: 'about'
  });
  });

  test('renderStudentAbout should handle errors and send 500', async () => {
  // arrange: mocks the method getStudentById simulating an error
  studentService.getStudentById = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  req.params = { studentId: '1' };
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act: the method is actively being called here to check if the controller method is called (in this case, using the 'catch' conditional).
  await studentController.renderStudentAbout(req, res);

  // assert: here the results of the test can be visualized. the status "500" states an internal error loading the students.
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading student information');
  });

  test('renderStudentAbout should return 404 if the student cannot be found', async () => {
  // arrange
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(null);
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act: the method is actively being called here to check if the code is able to render the about.
  await studentController.renderStudentAbout(req, res);

  // assert: here the results of the test can be visualized. the status "404" states an error founding the students.
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Student not found');
  });

  test('renderStudentAbout should render the about view even if some elements are missing in the database', async () => {
  // arrange
  req.params = { studentId: '1' };
  const mockStudent = {
    id: '1',
    name: 'John Doe',
    academic_year: 2,
    // houses: undefined,
    // tutors: undefined
  };
  // guardianId not found
  // academic_year not found
  // house not found
  // teachers null
  // tutor not found

  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  const db = require('../config/db');
  db.query = jest
    .fn()
    // guardianId
    .mockResolvedValueOnce({ rows: [] })
    // academic_year
    .mockResolvedValueOnce({ rows: [] })
    // house (not called)
    // teachers
    .mockResolvedValueOnce({ rows: [] })
    // tutor (not called)
    ;

  res.render = jest.fn();

  // act
  await studentController.renderStudentAbout(req, res);

  // assert
  expect(res.render).toHaveBeenCalledWith('students/about', {
    student: mockStudent,
    form: 'Not found',
    houseName: 'Not found',
    teachers: [],
    tutor: null,
    guardianId: null,
    activePage: "about",
    year_code: 'Not found'
  });
  });

  test('renderStudentTimetable should render the timetable view properly', async () => {
    // arrange: mock parameters are being created.
    req.params = { studentId: '1' };
    const mockStudent = { id: '1', name: 'John Doe' };
    const mockGuardianId = 10;
    studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);
    const db = require('../config/db');
    db.query = jest.fn().mockResolvedValueOnce({ rows: [{ id: mockGuardianId }] });

    // mocks the render
    res.render = jest.fn();

    // act: the method is actively being called here to check if the code is able to render the timetable.
    await studentController.renderStudentTimetable(req, res);

    // assert: here the results of the test can be visualized. the test is successful if the view (students/timetable) is rendered.
    expect(studentService.getStudentById).toHaveBeenCalledWith('1');
    expect(db.query).toHaveBeenCalledWith(
      'SELECT id FROM guardians WHERE fk_students_id = $1',
      [mockStudent.id]
    );
    expect(res.render).toHaveBeenCalledWith('students/timetable', {
      student: mockStudent,
      guardianId: mockGuardianId,
      activePage: "timetable"
    });
  });

  test('renderStudentTimetable should return 404 if the student cannot be found', async () => {
  // arrange: mocks student not found
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(null);
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act: 
  await studentController.renderStudentTimetable(req, res);

  // assert: 
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Student not found');
  });

  test('renderStudentTimetable should handle errors and send 500', async () => {
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  await studentController.renderStudentTimetable(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading the timetable');
  });

  test('renderStudentTimetable should render the timetable view even if guardianId is missing', async () => {
  // arrange:
  req.params = { studentId: '1' };
  const mockStudent = { id: '1', name: 'John Doe' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  const db = require('../config/db');
  db.query = jest.fn().mockResolvedValueOnce({ rows: [] }); // guardianId not found

  res.render = jest.fn();

  // act:
  await studentController.renderStudentTimetable(req, res);

  // assert:
  expect(res.render).toHaveBeenCalledWith('students/timetable', {
    student: mockStudent,
    guardianId: null,
    activePage: "timetable"
  });
  });

  test('renderStudentReports must render the students reports properly', async () => {
  // arrange
  req.params = { studentId: '1' };
  const mockStudent = { id: '1', name: 'John Doe', student_photo: 'photo.jpg' };
  const mockGuardianId = 10;
  const mockReports = [
    { file_name: 'report1.pdf', file_url: 'pdfs/report1.pdf' },
    { file_name: 'report2.pdf', file_url: 'pdfs/report2.pdf' }
  ];
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  // Mock storageService
  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest.fn().mockResolvedValue('signed-photo-url');
  storageService.generateSignedPDF = jest.fn()
    .mockResolvedValueOnce('signed-pdf-url-1')
    .mockResolvedValueOnce('signed-pdf-url-2');

  // Mock DB
  const db = require('../config/db');
  db.query = jest
    .fn()
    .mockResolvedValueOnce({ rows: [{ id: mockGuardianId }] }) // guardianId
    .mockResolvedValueOnce({ rows: mockReports }); // reports

  res.render = jest.fn();

  // act
  await studentController.renderStudentReports(req, res);

  // assert
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo.jpg');
  expect(storageService.generateSignedPDF).toHaveBeenCalledWith('report1.pdf');
  expect(storageService.generateSignedPDF).toHaveBeenCalledWith('report2.pdf');
  expect(res.render).toHaveBeenCalledWith('students/reports', {
    student: { ...mockStudent, signed_photo_url: 'signed-photo-url' },
    reports: [
      { file_name: 'report1.pdf', file_url: 'signed-pdf-url-1' },
      { file_name: 'report2.pdf', file_url: 'signed-pdf-url-2' }
    ],
    guardianId: mockGuardianId,
    activePage: 'reports'
  });
});

  test('renderStudentReports should return 404 if the student cannot be found', async () => {
  // arrange: simula estudante não encontrado
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(null);
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act
  await studentController.renderStudentReports(req, res);

  // assert
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Student not found');
});

  test('renderStudentReports should handle errors and send 500', async () => {
  req.params = { studentId: '1' };
  studentService.getStudentById = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  await studentController.renderStudentReports(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading student reports');
});

  test('renderStudentReports should render the reports view even if guardianId is missing', async () => {
  // arrange
  req.params = { studentId: '1' };
  const mockStudent = { id: '1', name: 'John Doe', student_photo: 'photo.jpg' };
  studentService.getStudentById = jest.fn().mockResolvedValueOnce(mockStudent);

  // Mock storageService
  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest.fn().mockResolvedValue('signed-photo-url');
  storageService.generateSignedPDF = jest.fn().mockResolvedValue('signed-pdf-url');

  // Mock DB
  const db = require('../config/db');
  db.query = jest
    .fn()
    .mockResolvedValueOnce({ rows: [] }) // guardianId não encontrado
    .mockResolvedValueOnce({ rows: [{ file_name: 'report1.pdf', file_url: 'pdfs/report1.pdf' }] });

  res.render = jest.fn();

  // act
  await studentController.renderStudentReports(req, res);

  // assert
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo.jpg');
  expect(storageService.generateSignedPDF).toHaveBeenCalledWith('report1.pdf');
  expect(res.render).toHaveBeenCalledWith('students/reports', {
    student: { ...mockStudent, signed_photo_url: 'signed-photo-url' },
    reports: [{ file_name: 'report1.pdf', file_url: 'signed-pdf-url' }],
    guardianId: null,
    activePage: 'reports'
  });
});

  test('renderGuardianInfo should render the personal information page properly', async () => {
  // arrange
  req.params = { guardianId: '1' };
  const mockGuardian = { id: 1, fk_students_id: 2, name: 'Guardian Name' };
  const mockStudent = { id: 2, name: 'Student Name' };

  const db = require('../config/db');
  db.query = jest
    .fn()
    // guardian query
    .mockResolvedValueOnce({ rows: [mockGuardian] })
    // student query
    .mockResolvedValueOnce({ rows: [mockStudent] });

  res.render = jest.fn();

  // act
  await studentController.renderGuardianInfo(req, res);

  // assert
  expect(db.query).toHaveBeenCalledWith(
    'SELECT * FROM guardians WHERE id = $1',
    ['1']
  );
  expect(db.query).toHaveBeenCalledWith(
    'SELECT * FROM students WHERE id = $1',
    [mockGuardian.fk_students_id]
  );
  expect(res.render).toHaveBeenCalledWith('students/pi', {
    guardian: mockGuardian,
    student: mockStudent,
    guardianId: mockGuardian.id,
    activePage: "pi"
  });
});

test('renderGuardianInfo should return 404 if guardian not found', async () => {
  // arrange
  req.params = { guardianId: '1' };
  const db = require('../config/db');
  db.query = jest.fn().mockResolvedValueOnce({ rows: [] }); // guardian not found

  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  // act
  await studentController.renderGuardianInfo(req, res);

  // assert
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith('Guardian not found');
});

  test('renderGuardianInfo should handle errors and send 500', async () => {
  req.params = { guardianId: '1' };
  const db = require('../config/db');
  db.query = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  await studentController.renderGuardianInfo(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading guardian information');
  });


test('getStudentsByGuardian should render children view with students if guardian and children exist', async () => {
  // arrange
  req.params = { guardianId: '1' };
  const mockGuardian = { email_guardians: 'guardian@email.com' };
  const mockStudents = [
    { id: 1, student_name: 'John', student_last_name: 'Doe', student_photo: 'photo1.jpg' },
    { id: 2, student_name: 'Jane', student_last_name: 'Doe', student_photo: 'photo2.jpg' }
  ];
  const mockSignedUrls = ['signedUrl1', 'signedUrl2'];

  const db = require('../config/db');
  db.query = jest
    .fn()
    // guardian email
    .mockResolvedValueOnce({ rows: [mockGuardian] })
    // students
    .mockResolvedValueOnce({ rows: mockStudents });

  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest
    .fn()
    .mockResolvedValueOnce(mockSignedUrls[0])
    .mockResolvedValueOnce(mockSignedUrls[1]);

  res.render = jest.fn();

  // act
  await studentController.getStudentsByGuardian(req, res);

  // assert
  expect(db.query).toHaveBeenCalledWith(
    'SELECT email_guardians FROM guardians WHERE id = $1',
    ['1']
  );
  expect(db.query).toHaveBeenCalledWith(
    `SELECT s.id, s.student_name, s.student_last_name, s.student_photo
       FROM students s
       INNER JOIN guardians g ON g.fk_students_id = s.id
       WHERE g.email_guardians = $1`,
    [mockGuardian.email_guardians]
  );
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo1.jpg');
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo2.jpg');
  expect(res.render).toHaveBeenCalledWith('students/children', {
    students: [
      { ...mockStudents[0], signed_photo_url: mockSignedUrls[0] },
      { ...mockStudents[1], signed_photo_url: mockSignedUrls[1] }
    ]
  });
});

test('getStudentsByGuardian should render children view with empty students if guardian not found', async () => {
  // arrange
  req.params = { guardianId: '1' };
  const db = require('../config/db');
  db.query = jest.fn().mockResolvedValueOnce({ rows: [] }); // Guardian not found

  res.render = jest.fn();

  // act
  await studentController.getStudentsByGuardian(req, res);

  // assert
  expect(res.render).toHaveBeenCalledWith('students/children', { students: [] });
});

  test('getStudentsByGuardian should handle errors and send 500', async () => {
  req.params = { guardianId: '1' };
  const db = require('../config/db');
  db.query = jest.fn().mockRejectedValueOnce(new Error('DB error'));
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn();

  await studentController.getStudentsByGuardian(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith('Error loading students');
  });

  test('getStudentsByGuardian should render students even if some students have no photo', async () => {
  // Arrange
  req.params = { guardianId: '1' };
  const mockGuardian = { email_guardians: 'guardian@email.com' };
  const mockStudents = [
    { id: 1, student_name: 'John', student_last_name: 'Doe', student_photo: 'photo1.jpg' },
    { id: 2, student_name: 'Jane', student_last_name: 'Doe', student_photo: null }
  ];

  const db = require('../config/db');
  db.query = jest
    .fn()
    .mockResolvedValueOnce({ rows: [mockGuardian] }) // guardian
    .mockResolvedValueOnce({ rows: mockStudents });  // students

  const storageService = require('../services/storageService');
  storageService.generateSignedUrl = jest
    .fn()
    .mockResolvedValueOnce('signedUrl1') // para o primeiro estudante
    .mockResolvedValueOnce(null);        // para o segundo estudante sem foto

  res.render = jest.fn();

  // Act
  await studentController.getStudentsByGuardian(req, res);

  // Assert
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith('photo1.jpg');
  expect(storageService.generateSignedUrl).toHaveBeenCalledWith(null);
  expect(res.render).toHaveBeenCalledWith('students/children', {
    students: [
      { ...mockStudents[0], signed_photo_url: 'signedUrl1' },
      { ...mockStudents[1], signed_photo_url: null }
    ]
  });
});


});
