select
employee.first_name as first_name, employee.last_name as last_name, role.id as role_id,employee.manager_id as manager_id from employee

/*join employee on employee.manager_id=manager_id;*/
join role on employee.role_id=role.id;