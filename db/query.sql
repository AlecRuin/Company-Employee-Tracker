/*select
employee.first_name as first_name, employee.last_name as last_name, role.id as role_id,employee.manager_id as manager_id
 from employee

join role on employee.role_id=role.id;*/
select t1.first_name, t1.last_name, role.title,role.salary,department.name as Department, concat (m.first_name, " ",m.last_name) as manager
from employee t1

left join employee m on t1.manager_id = m.id
left join role on t1.role_id=role.id
join department on role.department_id=department.id;

/*, employee t2*/
/*join employee t2 on t1.manager_id=t2.manager_id*/
/*,t2.manager_id*/