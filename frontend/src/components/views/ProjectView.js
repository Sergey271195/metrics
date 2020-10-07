import React, { useContext } from 'react'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import ToMainButton from '../routerbuttons/ToMainButton'

const ProjectView = () => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)
    const project = views.project.data

    return(

        <div style = {{display: 'flex'}}>

            {/* Local Info */}
            <div style = {{display: 'flex', flexDirection: 'column'}}>

                <ToMainButton />
                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div>Инофрмация из базы</div>
                    <div onClick = {() => switchToProjectView()} style = {{
                        display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px'
                    }}>
                        <div>Название проекта: {project.name}</div>
                        <div>Тип проекта: {project.type}</div>
                        <div>Связанный вебсайт: {project.webpage.name}</div>

                        <div>Связанные сотрудники</div>
                        <div style = {{marginLeft: '10px'}}>
                            {/* Implement switch to employee view */}
                            
                            {project.employees.map(employee => {
                                console.log(employee)
                                return <div key = {employee.id}>{employee.name} - {employee.role}</div>
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Jandex Info */}
            <div style = {{display: 'flex', flexDirection: 'column'}}>

                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div>Инофрмация из Яндекса</div>
                    
                </div>
            
            </div>

        </div>
    )
}

export default ProjectView