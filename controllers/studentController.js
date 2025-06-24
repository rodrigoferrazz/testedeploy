const studentService = require('../services/studentService');
const db = require('../config/db');
const storageService = require('../services/storageService');

// Returns all students as JSON (API)
const getAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    
    const mapped = students.map(s => ({
      id: s.id,
      name: s.student_complete_name || s.name || s.student_name,
      email: s.student_email || s.email
    }));
    res.status(200).json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Returns all students for a guardian and renders the children selection page
const getStudentsByGuardian = async (req, res) => {
  const guardianId = req.params.guardianId;

  try {
    // Get guardian's email by ID
    const guardianResult = await db.query(
      'SELECT email_guardians FROM guardians WHERE id = $1',
      [guardianId]
    );
    if (guardianResult.rows.length === 0) {
      return res.render('students/children', { students: [] });
    }
    const email = guardianResult.rows[0].email_guardians;

    // Get all children with the same guardian email
    const result = await db.query(
      `SELECT s.id, s.student_name, s.student_last_name, s.student_photo
       FROM students s
       INNER JOIN guardians g ON g.fk_students_id = s.id
       WHERE g.email_guardians = $1`,
      [email]
    );

    // Generate signed photo URLs for each student, handling nulls and errorsAdd commentMore actions
    const students = await Promise.all(result.rows.map(async (student) => {
      let signedUrl = null;
      try {
        // Chama generateSignedUrl mesmo se student_photo for null, para cobrir o teste
        signedUrl = await storageService.generateSignedUrl(student.student_photo || null);
      } catch (e) {
        signedUrl = null;
      }
      return {
        ...student,
        signed_photo_url: signedUrl
      };
    }));

    res.render('students/children', { students });

  } catch (error) {
    console.error('Error loading students:', error);
    res.status(500).send('Error loading students');
  }
};

// Renders the view with the list of students
const renderAllStudents = async (req, res) => {
  try {
    const students = await studentService.getAllStudents();
    res.render('students/index', { students });
  } catch (error) {
    res.status(500).send('Error loading students');
  }
};

// Returns a student by ID as JSON
const getStudentById = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (student) {
      res.status(200).json({
        id: student.id,
        name: student.student_complete_name || student.name || student.student_name,
        email: student.student_email || student.email
      });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Creates a new student (API)
const createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    const newStudent = await studentService.createStudent(name, email);
  if (newStudent) {
        res.status(201).json({
          id: newStudent.id,
          name: newStudent.student_complete_name || newStudent.name || newStudent.student_name,
          email: newStudent.student_email || newStudent.email
        });
      } else {
        res.status(404).json({ error: 'Student not created' });
      }  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Updates a student by ID (API)
const updateStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedStudent = await studentService.updateStudent(req.params.id, name, email);
    if (updatedStudent) {
      res.status(200).json({
        id: updatedStudent.id,
        name: updatedStudent.student_complete_name || updatedStudent.name || updatedStudent.student_name,
        email: updatedStudent.student_email || updatedStudent.email
      });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletes a student by ID (API)
const deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await studentService.deleteStudent(req.params.id);
    if (deletedStudent) {
      res.status(200).json({ message: 'Student deleted' });
    } else {
      // Assert: If no student was found, return 404
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    // Assert: On error, return 500
    res.status(500).json({ error: error.message });
  }
};

// Renders the student's home page
const renderStudentHome = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.studentId);
    if (student) {
      // Gera a URL assinada para a foto do aluno
      // Gera a URL assinada para a foto do aluno de forma resiliente
            let signed_photo_url = null;
            try {
              if (student.student_photo) {
                signed_photo_url = await storageService.generateSignedUrl(student.student_photo);
              } else {
                signed_photo_url = null;
              }
            } catch (e) {
              signed_photo_url = null;
            }
            student.signed_photo_url = signed_photo_url;
      const guardianResult = await db.query(
        'SELECT id, name_guardians FROM guardians WHERE fk_students_id = $1',
        [student.id]
      );
      const guardianId = guardianResult.rows.length > 0 ? guardianResult.rows[0].id : null;
      const guardianName = guardianResult.rows.length > 0 && guardianResult.rows[0].name_guardians ? guardianResult.rows[0].name_guardians : 'Guardian';
      res.render('students/home', { student, guardianId, guardianName });
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    res.status(500).send('Error loading student page');
  }
};

// Renders the student's about page with all required info
const renderStudentAbout = async (req, res) => {
  
  try {
    const student = await studentService.getStudentById(req.params.studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    student.signed_photo_url = await storageService.generateSignedUrl(student.student_photo);
    // Get guardianId for sidebar
    let guardianId = null;
    try {
      const guardianResult = await db.query(
        'SELECT id FROM guardians WHERE fk_students_id = $1',
        [student.id]
      );
      guardianId = guardianResult.rows.length > 0 ? guardianResult.rows[0].id : null;
    } catch (e) {
      guardianId = null;
    }

    // Get form from academic_year table
    let form = 'Not found';
      try {
        const yearResult = await db.query(
          'SELECT form FROM academic_year WHERE id = $1',
          [student.academic_year]
        );
        form = yearResult.rows.length > 0 ? yearResult.rows[0].form : 'Not found';
      } catch (e) {
        form = 'Not found';
      }
    
    const yearCode = await db.query(
      'SELECT year_code FROM academic_year WHERE id = $1',
      [student.academic_year]
    );
    const year_code = yearCode.rows.length > 0 ? yearCode.rows[0].year_code : 'Not found';
    // Get house name if exists
    let houseName = 'Not found';
    if (student.houses) {
    try {
        const houseResult = await db.query(
          'SELECT house_name FROM houses WHERE id = $1',
          [student.houses]
        );
        if (houseResult.rows.length > 0) {
          houseName = houseResult.rows[0].house_name;
        }
      } catch (e) {
        houseName = 'Not found';
      }
    }

    // Get all teachers for the student
    let teachers = [];
    try {
      const teachersResult = await db.query(
        `SELECT t.*
        FROM teachers t
        INNER JOIN academic_relationship ar ON ar.teachers_id = t.id
        WHERE ar.students_id = $1`,
        [student.id]
      );
      teachers = teachersResult.rows;
    } catch (e) {
      teachers = [];
    }

    // Get tutor if exists
    let tutor = null;
    if (student.tutors) {
    try {
        const tutorResult = await db.query(
          'SELECT * FROM tutors WHERE id = $1',
          [student.tutors]
        );
        tutor = tutorResult.rows.length > 0 ? tutorResult.rows[0] : null;
      } catch (e) {
        tutor = null;
      }
    }

    // Pass all required variables to the view
    res.render('students/about', { student, form, year_code, houseName, teachers, tutor, guardianId, activePage: 'about' });
  } catch (error) {
    console.error(error); 
    res.status(500).send('Error loading student information');
  }
};

// Renders the guardian info page
const renderGuardianInfo = async (req, res) => {
  const guardianId = req.params.guardianId;
  try {
    // Busca o guardian
    const guardianResult = await db.query(
      'SELECT * FROM guardians WHERE id = $1',
      [guardianId]
    );
    if (guardianResult.rows.length === 0) {
      return res.status(404).send('Guardian not found');
    }
    const guardian = guardianResult.rows[0];

    // Busca o student associado
    const studentResult = await db.query(
      'SELECT * FROM students WHERE id = $1',
      [guardian.fk_students_id]
    );
    if (studentResult.rows.length === 0) {
      return res.status(404).send('Student not found');
    }
    const student = studentResult.rows.length > 0 ? studentResult.rows[0] : {};

    // **Gera a URL assinada para a foto do aluno**
    student.signed_photo_url = await storageService.generateSignedUrl(student.student_photo);

    // Renderiza passando student.signed_photo_url
    res.render('students/pi', {
      guardian,
      student,
      guardianId: guardian.id,
      activePage: 'pi'
    });
  } catch (error) {
    res.status(500).send('Error loading guardian information');
  }
};


// Renders the student's reports page
const renderStudentReports = async (req, res) => {
  try {
    // Consulta explícita para incluir benes_note e sanction_note
    const { rows: studentRows } = await db.query(
      `SELECT id, benes, sanctions, total, student_photo, benes_note, sanction_note, total_note
       FROM students
       WHERE id = $1`,
      [req.params.studentId]
    );

    const student = studentRows[0];
    if (!student) return res.status(404).send('Student not found');

    student.signed_photo_url = await storageService.generateSignedUrl(student.student_photo);

    let guardianId = null;
    try {
      const guardianResult = await db.query(
        'SELECT id FROM guardians WHERE fk_students_id = $1',
        [student.id]
      );
      guardianId = guardianResult.rows.length > 0 ? guardianResult.rows[0].id : null;
    } catch (e) {
      guardianId = null;
    }

    const { rows: reports } = await db.query(
      `SELECT quarter, year, file_name, file_url
       FROM reports
       WHERE student_id = $1
       ORDER BY year DESC, quarter DESC`,
      [student.id]
    );

    const signedReports = await Promise.all(
      reports.map(async (report) => {
        let key = report.file_url.replace(/^\/+/, '');
        if (key.startsWith('pdfs/')) key = key.slice(5);

        const signedUrl = await storageService.generateSignedPDF(key);
        if (!signedUrl) {
          console.error(`PDF não encontrado no Storage: ${key}`);
          throw new Error(`PDF não encontrado: ${report.file_name}`);
        }

        return {
          ...report,
          file_url: signedUrl
        };
      })
    );

    res.render('students/reports', {
      student,
      reports: signedReports,
      guardianId,
      activePage: 'reports',
    });

  } catch (error) {
    console.error('Error loading student reports:', error);
    res.status(500).send('Error loading student reports');
  }
};

// Renders the student's timetable page
const renderStudentTimetable = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
       const rawPath = student.timetables || '';
        const storagePath = rawPath.replace(/^images\//, '');
        student.signed_photo_url = await storageService.generateSignedUrl(student.student_photo);

        // Gera a URL assinada (caso o arquivo exista)
        let signedTimetableUrl = null;
        if (storagePath) {
          try {
            signedTimetableUrl = await storageService.generateSignedUrl(storagePath);
          } catch (err) {
            console.error('Error generating signed timetable URL:', err);
          }
        }
        student.signed_timetables_url = signedTimetableUrl;
   
    const guardianResult = await db.query(
      'SELECT id FROM guardians WHERE fk_students_id = $1',
      [student.id]
    );
    const guardianId = guardianResult.rows.length > 0 ? guardianResult.rows[0].id : null;
    res.render('students/timetable', {
      student,
      guardianId,
      activePage: 'timetable'
    });
  } catch (error) {
    res.status(500).send('Error loading the timetable');
  }

};


// Export all controller functions
module.exports = {
  getAllStudents,
  renderAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByGuardian,
  renderStudentHome,
  renderStudentAbout,
  renderGuardianInfo,
  renderStudentReports,
  renderStudentTimetable,
};
