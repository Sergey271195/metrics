import React, { useState, useEffect, useContext } from 'react'
import OrderComponent from '../projectviewcomponents/OrderComponent'
import LeadsComponent from '../projectviewcomponents/leadspackage/LeadsComponent'
import { useParams } from 'react-router-dom'
import { ViewsContext } from '../../context/ViewsContext'
import ProjectOptionsView from './ProjectOptionsView'

const ProjectView = () => {

    let { id } = useParams()
    const { dispatchViews } = useContext(ViewsContext)
    const [ goals, setGoals ] = useState()
    const [ optionsview, setOptionsView ] = useState(false)

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

    useEffect(() => {
        switchToProjectView()
    }, [id])

    const [ updatePlot, setUpdatePlot ] = useState(true)
    if (optionsview) {
        return (
            <div style = {{display: 'flex', flexDirection: 'column'}}>
                <button onClick = {() => setOptionsView(false)}>На главную страницу проекта</button>
                <ProjectOptionsView goals = {goals} setGoals = {setGoals}/>
            </div>
        )
    }
    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <button onClick = {() => setOptionsView(true)}>Настройки проекта</button>
            <div style = {{display: 'flex'}}>
                <div style  = {{marginLeft: '20px'}}>Заказы</div>
            </div>
            
            <div style = {{display: 'flex', flexDirection: 'column'}}>
                <OrderComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/>
                <LeadsComponent updatePlot = {updatePlot} goals = {goals} setGoals = {setGoals}/>
            </div>
        </div>
    )
}

export default ProjectView