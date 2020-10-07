import React, { useContext } from 'react'
import { ViewsContext } from '../../context/ViewsContext'

const ShortProjectItemComponent = ({id, name, type, webpage}) => {

    const { dispatchViews } = useContext(ViewsContext)

    const switchToProjectView = () => {

        fetch(`/api/project/get/${id}`)
            .then(response => response.json())
                .then(data => {
                    if (data.STATUS_CODE != 404) {
                        dispatchViews({type: 'PROJECT_VIEW', data: data})
                    }
                })
                    .catch(error => console.log(error))

    }

    return(
        <div onClick = {() => switchToProjectView()} style = {{
            display: 'flex', flexDirection: 'column', border: '1px solid black', marginLeft: '50px', padding: '10px'
        }}>
            <div>Название проекта: {name}</div>
            <div>Тип проекта: {type}</div>
            <div>Связанный вебсайт: {webpage.name}</div>
        </div>
    )

}

export default ShortProjectItemComponent