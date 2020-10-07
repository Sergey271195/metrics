import React, { useState, useContext, useEffect } from 'react'
import { PostFetch } from './Utils'
import { EmployeeContext } from '../context/EmployeeContext'

const CreateEmployeeComponent = () => {

    const { dispatchEmployee } = useContext(EmployeeContext) 
    
    useEffect(() => {
        fetch('api/employee/getall')
        .then(response => response.json())
            .then(data => dispatchEmployee({type: 'FETCH', data: data}))
                .catch(error => console.log(error))
    }, [])


    const [formData, setFormData] = useState({
        name: '',
        role: 'PH'
    })

    const CreateEmployee = (event) => {
        event.preventDefault()

        const post_data = formData
        if (post_data.name !== '') {

            PostFetch('api/employee/create', post_data)
                .then(data => {
                    if (data.STATUS_CODE == 404) return
                    dispatchEmployee({type: 'CREATE', data: data})
                })
                    .catch(error => console.log(error))

        }
    }


    // For testing purposes

    //<button onClick = {(event) => GetEmployee(event)}>Get</button>
    /* const GetEmployee = (event) => {
        event.preventDefault()
        fetch('api/employee/getall')
        .then(response => response.json())
            .then(data => console.log(data))
                .catch(error => console.log(error))
    } */


    return(
        <div>
            <form style = {{display: 'flex', flexDirection: 'column'}} onSubmit = {(event) => CreateEmployee(event)}>

                <input id = 'employee_name' value = {formData.name} placeholder = 'Имя'
                    onChange = {(event) => setFormData({...formData, name: event.target.value})}></input>
                <select value = {formData.role} onChange = {(event) => setFormData({...formData, role: event.target.value})}>
                    <option value = 'PH'>Руководитель проекта</option>
                    <option value = 'IM'>Интернет-маркетолог</option>
                    <option value = 'SS'>SEO-специалист</option>
                </select>
                <button>Добавить сотрудника</button>

            </form>
        </div>
    )

}

export default CreateEmployeeComponent