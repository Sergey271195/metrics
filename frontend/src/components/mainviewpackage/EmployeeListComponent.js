import React, { useContext } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'
import EmployeeListItemComponent from './EmployeeListItemComponent'

const EmployeeListComponent = () => {
    
    const { employee } = useContext(EmployeeContext)

        return(
            <div>
                {employee && employee.map(emp => {
                    return(
                        <EmployeeListItemComponent key = {emp.id} id = {emp.id} name = {emp.name} role = {emp.role}/>
                    )
                })}
            </div>
        )
}

export default EmployeeListComponent
