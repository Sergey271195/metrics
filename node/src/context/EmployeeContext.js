import React, { createContext, useReducer } from 'react'
import { EmployeeReducer } from '../reducers/EmployeeReducer'


export const EmployeeContext = createContext();

const EmployeeContextProvider  = (props) => {

    const [employee, dispatchEmployee] = useReducer(EmployeeReducer, [])

    return (
        <EmployeeContext.Provider value = {{employee, dispatchEmployee}}>
            {props.children}
        </EmployeeContext.Provider>
    )

}

export default EmployeeContextProvider