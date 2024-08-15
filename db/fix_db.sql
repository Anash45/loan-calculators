-- Drop the existing foreign key constraint
ALTER TABLE employees
DROP FOREIGN KEY employees_ibfk_1;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE employees
ADD CONSTRAINT employees_ibfk_1
FOREIGN KEY (department) REFERENCES departments (department_id)
ON DELETE CASCADE;

-- Drop the existing foreign key constraint
ALTER TABLE attendance
DROP FOREIGN KEY attendance_ibfk_1;

-- Add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE attendance
ADD CONSTRAINT attendance_ibfk_1
FOREIGN KEY (emp_id) REFERENCES employees (emp_id)
ON DELETE CASCADE;
