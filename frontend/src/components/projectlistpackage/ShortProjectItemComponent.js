import React, { useContext } from 'react'
import { ProjectsContext } from '../../context/ProjectsContext'
import { ViewsContext } from '../../context/ViewsContext'

const ShortProjectItemComponent = ({id, name, type, webpage}) => {

    const { dispatchViews } = useContext(ViewsContext)
    const { dispatchProjects } = useContext(ProjectsContext)

    const deleteProject = () => {
        fetch(`/api/project/delete/${id}`)
            .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.STATUS_CODE == 200) {
                        dispatchProjects({type: 'DELETE', id: id})
                    }
                }).catch(error => console.log(error))
    }

    const switchToProjectView = () => {

        fetch(`/api/project/get/${id}`)
            .then(response => response.json())
                .then(data => {
                    if (data.STATUS_CODE != 404) {
                        dispatchViews({type: 'PROJECT_VIEW', data: data})
                    }
                })
                    .catch(error => console.log(error))

    }

    return(
        <div style = {{display: 'flex', flexDirection: 'column', marginRight: '50px'}}>
            <div onClick = {() => switchToProjectView()} style = {{
                display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px'
            }}>
                <div>Название проекта: {name}</div>
                <div>Тип проекта: {type}</div>
                <div>Связанный вебсайт: {webpage.name}</div>
            </div>
            <button onClick = {() => deleteProject()}>Удалить проект</button>
        </div>
    )

}

export default ShortProjectItemComponent