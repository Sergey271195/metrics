import React, { useContext, useEffect } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'
import EmployeeListComponent from '../mainviewpackage/EmployeeListComponent'
import ProjectListComponent from '../projectlistpackage/ProjectListComponent'
import CreateProjectComponent from '../createprojectpackage/CreateProjectComponent'

const MainView = () => {

    const { dispatchEmployee } = useContext(EmployeeContext) 
    
    useEffect(() => {
        fetch('api/employee/getall')
        .then(response => response.json())
            .then(data => dispatchEmployee({type: 'FETCH', data: data}))
                .catch(error => console.log(error))
    }, [])

    return(
        <div style = {{display: 'flex'}}>
            <div>
                <div>Сотрудники</div>
                <EmployeeListComponent />
            </div>
            <div>
                <div>Проекты</div>
                <ProjectListComponent type = {{full: false}} />
            </div>
            <CreateProjectComponent />
        </div>
    )
}

export default MainView