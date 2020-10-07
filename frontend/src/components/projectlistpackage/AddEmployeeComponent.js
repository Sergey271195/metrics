import React, { useContext, useState } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'
import { ProjectsContext } from '../../context/ProjectsContext'


const AddEmployeeComponent = ({employees, project_id}) => {

    const { employee } = useContext(EmployeeContext)
    const { dispatchProjects } = useContext(ProjectsContext)
    const [ employeeToAdd, setEmployeeToAdd ] = useState()

    const ids = employees.reduce((arr, employee) => {
        arr.push(employee.id)
        return arr
    }, [])

    const addEmployee = (event) => {
        event.preventDefault()
        if (!employeeToAdd || employeeToAdd === '') return;
        fetch(`/api/project/add/project${project_id}/user${employeeToAdd}`)
            .then(response => response.json())
                .then(data => dispatchProjects({type: 'ADD_USER', employee: data, project_id: project_id}))


    }

    return(
        <form onSubmit = {(event) => addEmployee(event)}>
        <div>Добавить сотрудника</div>
        <select value = {employeeToAdd} onChange = {(event) => setEmployeeToAdd(event.target.value)}>
            <option></option>
            {employee && employee.filter(employee => !ids.includes(employee.id))
            .map(employee => {
                return <option key = {employee.id} value = {employee.id}>{employee.name}</option>
            })}
        </select>
        <button>Добавить</button>
        </form>
    ) 

}

export default AddEmployeeComponent