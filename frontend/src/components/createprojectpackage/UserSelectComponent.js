import React, { useContext } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'

const UserSelectComponent = ({connectedEmployee, setConnectedEmployee}) => {

    const { employee } = useContext(EmployeeContext)

        return(
            <div>
                <select value = { connectedEmployee } onChange = {(event) => setConnectedEmployee(event.target.value)}>
                    <option></option>
                    {employee && employee.map(emp => {
                        return(
                            <option key = {emp.id} value = {emp.id}>{emp.name}</option>
                        )
                    })}
                </select>
            </div>
        )
}

export default UserSelectComponent