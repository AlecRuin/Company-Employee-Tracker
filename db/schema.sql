drop database if exists company_db;
create database company_db;
use company_db;

create table department(
    id int not null auto_increment primary key,
    name varchar(30) not null
);
create table role(
    id int not null auto_increment primary key,
    title varchar(30) not null,
    salary decimal not null,
    department_id int,
    foreign key (department_id)/*put what you want to become a foreign key here*/
        references department(id)/*then put the table you want to reference along with the table's id here*/
);
create table employee (
    id int not null auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    foreign key (manager_id)
        references employee(id),
    foreign key (role_id)
        references role(id)
);