import React, { useContext, useEffect } from 'react'
import { ProjectsContext } from '../../context/ProjectsContext'
import ProjectItemComponent from './ProjectItemComponent'
import ShortProjectItemComponent from './ShortProjectItemComponent'

const ProjectListComponent = (type) => {

    const { projects, dispatchProjects } = useContext(ProjectsContext)

    useEffect(() => {
        fetch('/api/project/getall')
            .then(response => response.json())
                .then(data =>  {console.log(data), dispatchProjects({type: 'FETCH', data: data})})
                    .catch(error => console.log(error))
    }, [])

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            {projects && projects.map(project => {
                return type.full ?
                <ProjectItemComponent key = {project.id} id = {project.id} 
                        name = {project.name} type = {project._type} webpage = {project.webpage} employees= {project.employees}/>
                : <ShortProjectItemComponent key = {project.id} id = {project.id} 
                        name = {project.name} type = {project._type} webpage = {project.webpage}/>
            })}
        </div>
    )

}
export default ProjectListComponent
