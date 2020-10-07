import React from 'react'

const ProjecTypeSelectComponent = ({projectType, setProjectType}) => {

    const TYPE_OPTIONS = {
        IS: 'Интернет-магазин',
        CS: 'Корпоративный сайт'
    }  

    return(
        <div>
            <select value = {projectType} onChange = {(event) => setProjectType(event.target.value)}>
                <option></option>
                {Object.keys(TYPE_OPTIONS).map(key => {
                    return <option key = {key} value = {key}>{TYPE_OPTIONS[key]}</option>
                })}
            </select>
        </div>
    )

}

export default ProjecTypeSelectComponent