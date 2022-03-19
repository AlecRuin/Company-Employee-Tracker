INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary,department_id)
VALUES ("Salesperson",240000,1),
       ("Lead Engineer",500000,2),
       ("Engineer",600000,2),
       ("Software Engineer",100000,2),
       ("Account Manager",800000,3),
       ("Accountant",900000,3),
       ("Legal Team Lead",70000,4),
       ("Lawyer",780000,4);
insert into employee (first_name,last_name,role_id,manager_id)
values ("John","Doe",2,null),
("Jane","Sterling",4,1),
("Alex","Hogan",7,null),
("Frank","Truce",1,1),
("Smith","Night",3,3),
("Trent","Course",1,1),
("Jack","Valentine",7,3),
("Luis","Rodriguez",5,3),
("Romero","Jules",6,3);