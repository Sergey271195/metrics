import React, { useContext } from 'react'
import {Link} from 'react-router-dom'
import { ProjectsContext } from '../../context/ProjectsContext'

const ShortProjectItemComponent = ({id, name, type, webpage}) => {

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
        <div style = {{display: 'flex', flexDirection: 'column', marginRight: '50px'}}>
            <div style = {{display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px'}}>
                <div>Название проекта: {name}</div>
                <div>Тип проекта: {type}</div>
                <div>Связанный вебсайт: {webpage.name}</div>
            </div>
            <Link to = {`project/${id}`}>Данные по проекту</Link>
            <Link to = {`project/${id}/options`}>Настройки проекта</Link>
            <button onClick = {() => deleteProject()}>Удалить проект</button>
        </div>
    )

}

export default ShortProjectItemComponent