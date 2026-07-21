# CampusERP Database Design

## Tables

### departments

- id (Primary Key)
- name
- code
- created_at
- updated_at

### students

- id (Primary Key)
- roll_number
- first_name
- last_name
- email
- phone_number
- department_id (Foreign Key → departments.id)
- created_at
- updated_at

## Relationship

One Department → Many Students

departments.id
↓

students.department_id