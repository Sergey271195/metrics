import React from 'react'
import CreateEmployeeComponent from '../CreateEmployeeComponent'
import EmployeeListComponent from '../mainviewpackage/EmployeeListComponent'

const EmployeeView = () => {
    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <h1>Сотрудники</h1>
            <CreateEmployeeComponent />
            <EmployeeListComponent />
        </div>
    )
}

export default EmployeeView