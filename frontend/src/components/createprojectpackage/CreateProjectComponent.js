import React, { useState, useContext } from 'react'
import { ProjectsContext } from '../../context/ProjectsContext'
import { PostFetch } from '../Utils'
import ProjecTypeSelectComponent from './ProjectTypeSelectComponent'

import UserSelectComponent from './UserSelectComponent'
import WebpageSelectComponent from './WebpageSelectComponent'

const CreateProjectComponent = () => {

    const { dispatchProjects } = useContext(ProjectsContext)
    const [ connectedWebpage, setConnectedWebpage ] = useState()
    const [ connectedEmployee, setConnectedEmployee ] = useState()
    const [ projectType, setProjectType ] = useState()
    const [ projectName, setProjectName ] = useState('')

    // Later for refresh of webpages in db

    /* const RefreshWP = () => {
        fetch('/api/refreshwp/')
            .then(response => response.json())
                .then(data => console.log(data))
                    .catch(error => console.log(error))
    } */

    const createProject = (event) => {
        event.preventDefault()

        const postData = {
            name: projectName,
            _type: projectType,
            webpage: connectedWebpage,
            employee: connectedEmployee
        }

        console.log(JSON.stringify(postData))
        if (!projectName || projectName === '') return;
        if (!projectType || projectType === '') return;
        if (!connectedWebpage || connectedWebpage === '') return;
        if (!connectedEmployee || connectedEmployee === '') return;
        PostFetch('/api/project/create', postData)
            .then(data => {
                console.log(data)
                if (data.STATUS_CODE != 404) {
                    dispatchProjects({type: 'CREATE', data: data})
                }
            })
                .catch(error => console.log(error))

    }

    return(
        
        <form onSubmit = {(event) => createProject(event)} style = {{display: 'flex', flexDirection: 'column'}}>

            <input value = {projectName} onChange = {(event) => {setProjectName(event.target.value)}}
                    placeholder = 'Навзвание проекта'/>

            <WebpageSelectComponent connectedWebpage = {connectedWebpage}
                    setConnectedWebpage = {setConnectedWebpage}/>

            <UserSelectComponent connectedEmployee = {connectedEmployee}
                    setConnectedEmployee = {setConnectedEmployee}/>

            <ProjecTypeSelectComponent projectType = {projectType}
                    setProjectType = {setProjectType} />

            <button type = 'submit'>Создать новый проект</button>

        </form>

    )

}

export default CreateProjectComponent