const inquirer = require("inquirer")
const express = require("express")
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
function CreateNewEmployee(){

}
function CreateNewRole(){
    db.query("select department.id as 'Department Id',department.name as 'Department Name' from department",(err, DepartmentResults)=>{
        var DepartmentOptions=[]
        for (var x=0;x<DepartmentResults.length;x++){
            DepartmentOptions.push(DepartmentResults[x]["Department Name"])
        }
        console.log(DepartmentOptions)
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
            console.log(`insert into role (title,salary,department_id) values ("${answers.RoleName}",${Number(answers.RoleSalary)},${Number(DPTChoice)})`)
            db.query(`insert into role (title,salary,department_id) values ("${answers.RoleName}",${Number(answers.RoleSalary)},${Number(DPTChoice)})`,(err,results)=>{
                err ? console.error(err) : console.log("Role successfully created")
                AskAllQuestions()
            })
        })
    })
}
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
function ViewAllEmloyees(){
    db.query(`select t1.first_name as 'First name', t1.last_name as 'Last name', role.title as Title,role.salary as Salary,department.name as Department, concat (m.first_name, " ",m.last_name) as Manager
    from employee t1 left join employee m on t1.manager_id = m.id left join role on t1.role_id=role.id join department on role.department_id=department.id`,(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
function ViewAllDepartment(){
    db.query("select department.id as 'Department Id',department.name as 'Department Name' from department",(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
function ViewAllRoles(){
    db.query("select role.id as Id, role.title as Title, role.salary as Salary, Department.name as Department from role left join department on role.department_id=department.id",(err, results)=>{
        console.log("Results:")
        console.table(results)
        AskAllQuestions()
    })
}
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
                "Create new role"
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
        }else{
            console.error("Invalid choice")
        }
    })
}
AskAllQuestions()
/*db.query("select * from role",(err, results)=>{
    console.log("Results:")
    console.log(results)
})*/