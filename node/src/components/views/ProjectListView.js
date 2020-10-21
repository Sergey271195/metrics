import React from 'react'
import CreateProjectComponent from '../createprojectpackage/CreateProjectComponent'
import ProjectListComponent from '../projectlistpackage/ProjectListComponent'

const ProjectListView = () => {
    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <h1>Проекты</h1>
            <div style = {{display: 'flex', justifyContent: 'space-between'}}>
                <ProjectListComponent type = {{full: false}} />
                <CreateProjectComponent />
            </div>
        </div>
    )
}

export default ProjectListView
