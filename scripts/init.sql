/*
Initially, the team developed the database structure with tables containing the main student information, connecting the student table with these information tables through intermediary tables.
However, after discussions, we decided to create these relationships directly using foreign keys.
Additionally, to define user access levels, we initially considered creating a separate table to store access rules, but we have now modified this approach and currently use an access column that stores integers.
*/

-- First table created to store teacher information, including name and email.
-- This table will later be associated with students through the fk_teachers_id column.
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  teachers_name TEXT NOT NULL,
  teachers_email TEXT NOT NULL
);

-- Create the tutors table
CREATE TABLE IF NOT EXISTS tutors (
  id SERIAL PRIMARY KEY,
  tutors_name TEXT NOT NULL
);

-- Create the houses table
CREATE TABLE IF NOT EXISTS houses (
  id SERIAL PRIMARY KEY,
  house_name TEXT NOT NULL
);

-- Create the academic_year table
CREATE TABLE IF NOT EXISTS academic_year (
  id SERIAL PRIMARY KEY,
  form TEXT NOT NULL,
  year_code TEXT NOT NULL
);

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  student_last_name VARCHAR(100) NOT NULL,
  student_complete_name TEXT GENERATED ALWAYS AS (student_name || ' ' || student_last_name) STORED,
  birth_date DATE,
  gender VARCHAR(20),
  school_id INT,
  address VARCHAR(255),
  postal_code INT,
  student_email VARCHAR(100),
  doctor_number INT,
  doctor_flag BOOLEAN,
  doctor_flag_notes VARCHAR(255),
  houses INT,
  tutors INT,
  academic_year INT,
  benes TEXT,
  sanctions TEXT,
  total TEXT,
  fk_teachers_id INT,
  FOREIGN KEY (houses) REFERENCES houses(id),
  FOREIGN KEY (tutors) REFERENCES tutors(id),
  FOREIGN KEY (academic_year) REFERENCES academic_year(id),
  FOREIGN KEY (fk_teachers_id) REFERENCES teachers(id)
);

-- Create the guardians table
CREATE TABLE IF NOT EXISTS guardians (
  id SERIAL PRIMARY KEY,
  email_guardians TEXT NOT NULL UNIQUE,
  password_guardians TEXT NOT NULL,
  name_guardians TEXT NOT NULL,
  last_name_guardians TEXT NOT NULL,
  phone_guardians TEXT,
  relation TEXT,
  personal_id INTEGER,
  access INT,
  fk_students_id INT,
  FOREIGN KEY (fk_students_id) REFERENCES students(id)
);

-- Create the academic_relationship table (student-teacher relationship)
CREATE TABLE IF NOT EXISTS academic_relationship (
  students_id INT,
  teachers_id INT,
  FOREIGN KEY (teachers_id) REFERENCES teachers(id),
  FOREIGN KEY (students_id) REFERENCES students(id)
);

-- Remove unique constraint from academic_year.year_code
ALTER TABLE academic_year
DROP CONSTRAINT academic_year_year_code_key;

-- Change doctor_number column type to TEXT in students table
ALTER TABLE students
ALTER COLUMN doctor_number TYPE TEXT;

-- Change school_id column type to BIGINT in students table
ALTER TABLE students
ALTER COLUMN school_id TYPE BIGINT;

-- Adding two new students 
INSERT INTO students (
  student_name, student_last_name, birth_date, gender, address, postal_code,
  student_email, doctor_number, doctor_flag, doctor_flag_notes,
  houses, tutors, academic_year, school_id, benes, sanctions, total
)
VALUES 
('Ana', 'Ferreira', '2012-03-14', 'F', 'Rua da Paz, 101', '12345-678',
 'ana.ferreira@email.com', '(11)98888-0001', false, '• Allergy: Not Reported • Asthma: Not Reported • Dietary: Not Reported',
 18, 2, 101, 102001, '5[2]', '0[0]', '5[2]'),

('Bruno', 'Ferreira', '2010-06-20', 'M', 'Rua da Paz, 101', '12345-678',
 'bruno.ferreira@email.com', '(11)98888-0002', false, '• Allergy: Not Reported • Asthma: Not Reported • Dietary: Not Reported',
 18, 2, 101, 102002, '6[3]', '1[-1]', '7[2]');

INSERT INTO guardians (
  email_guardians, password_guardians, name_guardians, last_name_guardians,
  phone_guardians, relation, personal_id, access, fk_students_id
)
VALUES
('pai102@email.com', 'senhaSegura', 'Carlos', 'Ferreira', '(11)99999-0000', 'Parents', 102, 1, 108),

('pai102@email.com', 'senhaSegura', 'Carlos', 'Ferreira', '(11)99999-0000', 'Parents', 102, 1, 109);

-- Creating a reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  student_id BIGINT,
  file_name TEXT,
  file_url TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id)
)

-- Adding the timatables column
ALTER TABLE students
ADD COLUMN timetables TEXT;

UPDATE students
SET timetables = 'images/timetables/timetable.jpg';
