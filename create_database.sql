-- Create the database if not exists
CREATE DATABASE IF NOT EXISTS app_empresas;

-- Switch to the database
USE app_empresas;

-- Create the employees table if not exists
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    digital_signature BOOLEAN DEFAULT 0
);

-- Insert some initial data for testing
INSERT INTO employees (id, name, position, department, digital_signature) VALUES
('EMP001', 'John Doe', 'Software Developer', 'Engineering', 1),
('EMP002', 'Jane Smith', 'Project Manager', 'Management', 1),
('EMP003', 'Robert Johnson', 'UI/UX Designer', 'Design', 0);

-- Display the created data
SELECT * FROM employees; 