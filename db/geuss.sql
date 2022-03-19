select role.id as Id, role.title as Title, role.salary as Salary, Department.name as Department
from role

left join department on role.department_id=department.id;