import React, { useContext } from 'react'
import { EmployeeContext } from '../../context/EmployeeContext'

const EmployeeListItemComponent = ({id, name, role}) => {

    const { dispatchEmployee } = useContext(EmployeeContext)

    const DeleteEmployee = () => {
        if (!id) return
        fetch(`/api/employee/delete/${id}`)
            .then(response => response.json())
                .then(data => {
                    if (data.STATUS_CODE == 200) {
                        dispatchEmployee({
                            type: 'DELETE',
                            id: id
                        })
                    }  
                }).catch(error => console.log(error))
    }

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div>
                {name}
            </div>
            <div>
                {role}
            </div>
            <button  onClick = {() => {DeleteEmployee()}}> X </button>
        </div>
    )
}

export default EmployeeListItemComponent