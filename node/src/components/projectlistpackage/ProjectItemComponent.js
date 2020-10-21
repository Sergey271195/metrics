import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import { ProjectsContext } from '../../context/ProjectsContext'
import AddEmployeeComponent from './AddEmployeeComponent'


const ProjectItemComponent = ({id, name, type, webpage, employees}) => {

    const { dispatchProjects } = useContext(ProjectsContext) 

    const deleteProject = () => {
        fetch(`/api/project/delete/${id}`)
            .then(response => response.json())
                .then(data => {
                    if (data.STATUS_CODE == 200) {
                        dispatchProjects({type: 'DELETE', id: id})
                    }
                }).catch(error => console.log(error))
    }

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div>Название проекта: {name}</div>
            <div>Тип проекта: {type}</div>
            <div>Связанный вебсайт: {webpage.name}</div>
            <div>Связанные сотрудники</div>
            {employees && employees.map(employee => {
                return <div key = {employee.id}>{employee.name}</div>
            })}

            <AddEmployeeComponent employees = {employees} project_id = {id}/>
            <button onClick = {() => deleteProject()}>Удалить проект</button>

        </div>
    )

}

export default ProjectItemComponent