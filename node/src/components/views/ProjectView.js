import React, { useState, useEffect, useContext } from 'react'
import OrderComponent from '../projectviewcomponents/orderpackage/OrderComponent'
import LeadsComponent from '../projectviewcomponents/leadspackage/LeadsComponent'
import { ViewsContext } from '../../context/ViewsContext'
import ProjectOptionsView from './ProjectOptionsView'
import FilterRequestsComponent from '../projectviewcomponents/projectutilspackage/FilterRequestsComponent'

import {
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

const ProjectView = () => {

    let { id } = useParams()
    let { path, url } = useRouteMatch();
    const { dispatchViews } = useContext(ViewsContext)
    const [ goals, setGoals ] = useState()
    const [ updatePlot, setUpdatePlot ] = useState(true)

    const switchToProjectView = () => {
        console.log('switching project')
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
        if (!id) return
        switchToProjectView()
    }, [id])

    return(
        <div style = {{display: 'flex', width: '100%', justifyContent: 'center'}}>

            <div style = {{display: 'flex', flexDirection: 'column', width: '20%', backgroundColor: 'grey', height: '100%', marginRight: '50px'}}>
                <Link to = {`${url}/options`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Настройки проекта</Link>
                <Link to = {`${url}/leads`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Лиды</Link>
                <Link to = {`${url}`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Заказы</Link>  
            </div>

            <div style = {{display: 'flex', flexDirection: 'column', width: '80%'}}>
                <FilterRequestsComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot} />
                <Switch>
                    <Route exact path = {path}>
                        <OrderComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/>
                    </Route>
                    <Route path = {`${path}/leads`}>
                        <LeadsComponent updatePlot = {updatePlot} goals = {goals} setGoals = {setGoals}/>
                    </Route>
                    <Route path = {`${path}/options`}>
                        <ProjectOptionsView goals = {goals} setGoals = {setGoals}/>
                    </Route>
                </Switch>
            </div>
        </div>
    )
}

export default ProjectView