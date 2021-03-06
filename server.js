//Import all dependancies in file and reference them by variables
const inquirer = require("inquirer")
const express = require("express")
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//use express to log into mysql
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'May2301()',
      database: 'company_db'
    },
    console.log(`Connected to the inventory_db database.`)
);
/*this function calls mysql and gathers all employees and all roles. 
After prompting the user which employee to modify, 
it will show all availible role options. After picking an option, it will push this change to the database.
finally, it will call the AskAllQuestions function again to repeat the loop
*/
function ChangeEmployeeRole(){
    db.query(`select employee.id, concat(employee.first_name," ",employee.last_name) as Names from employee`,(err,EmployeeNames)=>{
        db.query(`select role.id,role.title from role`,(err,RoleResults)=>{
            var RoleOptions = []
            var EmployeeOptions=[]
            for (var x=0;x<RoleResults.length;x++){RoleOptions.push(RoleResults[x].title)}
            for (var x=0;x<EmployeeNames.length;x++){EmployeeOptions.push(EmployeeNames[x].Names)}
            inquirer.prompt([
                {
                    type:"list",
                    message:"Which employee do you want to change?",
                    name:"employee_selected",
                    choices:EmployeeOptions
                },
                {
                    type:"list",
                    message:"Which role would you like them to have?",
                    name:"role_choice",
                    choices:RoleOptions
                }
            ])
            .then((answers)=>{
                var RoleChoice
                var EmployeeChoice
                for (var x=0;x<RoleResults.length;x++){if (RoleResults[x].title==answers.role_choice){RoleChoice=RoleResults[x].id; break}}
                for (var x=0;x<EmployeeNames.length;x++){if (EmployeeNames[x].Names==answers.employee_selected){EmployeeChoice=EmployeeNames[x].id; break}}
                db.query(`update employee set role_id = ${RoleChoice} where id=${EmployeeChoice}`,(err,results)=>{
                    err ? console.error(err) : console.log("Role successfully created")
                    AskAllQuestions()
                })
            })
        })
    })
}
/*this function calls mysql and gathers all roles and all existing employees. 
After prompting the user new employee first name, last name, role, and manager, it will push this change to the database.
It uses 2 for-loops at the end to figure out what index the role and manager options belong to, and properly converts that into primary keys before sending the query
*/
function CreateNewEmployee(){
    db.query(`select role.id,role.title from role`,(err,RoleResults)=>{
        db.query(`select employee.id, concat(employee.first_name," ",employee.last_name) as Names from employee`,(err,EmployeeNames)=>{
            var RoleOptions = []
            var EmployeeOptions=["null"]
            for (var x=0;x<RoleResults.length;x++){RoleOptions.push(RoleResults[x].title)}
            for (var x=0;x<EmployeeNames.length;x++){EmployeeOptions.push(EmployeeNames[x].Names)}
            inquirer.prompt([
                {
                    message:"What is the employee's first name?",
                    name:"first_name"
                },
                {
                    message:"What is the employee's last name?",
                    name:"last_name"
                },
                {
                    type:"list",
                    message:"What is the role of the employee?",
                    choices:RoleOptions,
                    name:"EmployeeRole"
                },
                {
                    type:"list",
                    message:"Does the employee report to a manager?",
                    name:"ReportTo",
                    choices:EmployeeOptions
                }
            ]).then((answers)=>{
                var RoleChoice
                var ManagerChoice="null"
                for (var x=0;x<RoleResults.length;x++){if (RoleResults[x].title==answers.EmployeeRole){RoleChoice=RoleResults[x].id; break}}
                if (answers.ReportTo!="null"){
                    for (var x=0;x<EmployeeNames.length;x++){if (EmployeeNames[x].Names==answers.ReportTo){ManagerChoice=EmployeeNames[x].id; break}}
                }
                db.query(`insert into employee (first_name,last_name,role_id,manager_id) values ("${answers.first_name}","${answers.last_name}",${RoleChoice},${ManagerChoice})`,(err,results)=>{
                    err ? console.error(err) : console.log("Role successfully created")
                    AskAllQuestions()
                })
            })
        })
    })
}
/*
this function calls mysql and gathers all departments. 
After prompting the user which department the role belongs to, its salary, and its name, it will save this to the mysql database
It uses 1 for-loops at the end to figure out what index the department belong to, and properly converts that into primary keys before sending the query
*/
function CreateNewRole(){
    db.query("select department.id as 'Department Id',department.name as 'Department Name' from department",(err, DepartmentResults)=>{
        var DepartmentOptions=[]
        for (var x=0;x<DepartmentResults.length;x++){
            DepartmentOptions.push(DepartmentResults[x]["Department Name"])
        }
        inquirer
        .prompt([
            {
                name:"DepartmentSelected",
                message:"What department will the role belong to?",
                type:"list",
                choices:DepartmentOptions
            },
            {
                type:"number",
                message:"What is the salary of the given role?",
                name:"RoleSalary"
            },
            {
                name:"RoleName",
                message:"What is the name of the role?"
            }
        ])
        .then((answers)=>{
            var DPTChoice
            for (var x=0;x<DepartmentResults.length;x++){
                if (DepartmentResults[x]["Department Name"]==answers.DepartmentSelected){
                    DPTChoice=DepartmentResults[x]["Department Id"]
                    break
                }
            }
            db.query(`insert into role (title,salary,department_id) values ("${answers.RoleName}",${Number(answers.RoleSalary)},${Number(DPTChoice)})`,(err,results)=>{
                err ? console.error(err) : console.log("Role successfully created")
                AskAllQuestions()
            })
        })
    })
}
//this is simply asking what would be the name of the department. asking recieving the answer, it pushes that to the mysql database
function CreateNewDepartment(){
    inquirer
    .prompt([{name:"DepartmentName",message:"What will be the department name?"}])
    .then((answers)=>{
            db.query(`INSERT INTO department (name) VALUES (?)`,answers.DepartmentName,(err, results)=>{
            err ? console.error(err) : console.log("Department successfully created")
            AskAllQuestions()
        })
    })
}
//mysql command that references all 3 tables including self joining the employee table. 
function ViewAllEmloyees(){
    db.query(`select t1.first_name as 'First name', t1.last_name as 'Last name', role.title as Title,role.salary as Salary,department.name as Department, concat (m.first_name, " ",m.last_name) as Manager
    from employee t1 left join employee m on t1.manager_id = m.id left join role on t1.role_id=role.id join department on role.department_id=department.id`,(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
//mysql command to select all entries in department
function ViewAllDepartment(){
    db.query("select department.id as 'Department Id',department.name as 'Department Name' from department",(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
//mysql command to select all role entries, their salaries, and departments
function ViewAllRoles(){
    db.query("select role.id as Id, role.title as Title, role.salary as Salary, Department.name as Department from role left join department on role.department_id=department.id",(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
//function thats always called at the end of every answer to create an infinite loop. it asks all the questions to mess with employee data, role data, and department data.
function AskAllQuestions(){
    inquirer
    .prompt([
        {
            type:"list",
            message:"Choose action:",
            name:"ChoiceMade",
            choices:[
                "View all departments",
                "View all roles",
                "View all employees",
                "Create new department",
                "Create new role",
                "Create new employee",
                "Change employee role"
            ]
        }
    ]).then((answers)=>{
        if (answers.ChoiceMade=="View all departments"){
            ViewAllDepartment()
        }else if (answers.ChoiceMade=="View all roles"){
            ViewAllRoles()
        }else if(answers.ChoiceMade=="View all employees"){
            ViewAllEmloyees()
        }else if(answers.ChoiceMade=="Create new department"){
            CreateNewDepartment()
        }else if(answers.ChoiceMade=="Create new role"){
            CreateNewRole()
        }else if(answers.ChoiceMade=="Create new employee"){
            CreateNewEmployee()
        }else if(answers.ChoiceMade=="Change employee role"){
            ChangeEmployeeRole()
        }else{
            console.error("Invalid choice")
        }
    })
}
AskAllQuestions()