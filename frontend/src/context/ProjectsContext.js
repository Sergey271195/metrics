import React, { createContext, useReducer } from 'react'
import { ProjectsReducer } from '../reducers/ProjectsReducer'

export const ProjectsContext = createContext()

const ProjectsContextProvider = (props) => {

    const [projects, dispatchProjects] = useReducer(ProjectsReducer, [])

    return(
        <ProjectsContext.Provider value = {{projects, dispatchProjects}}>
            {props.children}
        </ProjectsContext.Provider>
    )

}

export default ProjectsContextProvider
