import React, { useState, useEffect, useContext } from 'react'
import {
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

import { ViewsContext } from '../../context/ViewsContext'

import OrderComponent from '../projectviewcomponents/orderpackage/OrderComponent'
import LeadsComponent from '../projectviewcomponents/leadspackage/LeadsComponent'
import ProjectOptionsView from './ProjectOptionsView'
import FilterRequestsComponent from '../projectviewcomponents/projectutilspackage/FilterRequestsComponent'
import MainInfoComponent from '../projectviewcomponents/maininfopackage/MainInfoComponent'
import FunnelComponent from '../projectviewcomponents/funnelpackage/FunnelComponent'
import TrafficTable from '../projectviewcomponents/traffictablepackage/TrafficTable';


const ProjectView = () => {

    let { id } = useParams()
    let { path, url } = useRouteMatch();
    const { dispatchViews } = useContext(ViewsContext)
    const [ goals, setGoals ] = useState()
    const [ updatePlot, setUpdatePlot ] = useState(true)
    const [ loading, setLoading ] = useState(true)

    const switchToProjectView = () => {
        console.log('switching project')
        setLoading(true)
        fetch(`/api/project/get/${id}`)
            .then(response => response.json())
                .then(data => {
                    if (data.STATUS_CODE != 404) {
                        dispatchViews({type: 'PROJECT_VIEW', data: data})
                    }
                }).then(() => setLoading(false))
                    .catch(error => console.log(error))
    }

    useEffect(() => {
        if (!id) return
        switchToProjectView()
    }, [id])

    if (loading) {
        return <div style = {{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading</div>
    }

    return(
        <div style = {{display: 'flex', width: '100%', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>

            {/* <div style = {{display: 'flex', flexDirection: 'column', width: '20%', backgroundColor: 'grey', height: '100%', marginRight: '50px'}}>
                <Link to = {`${url}/options`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Настройки проекта</Link>
                <Link to = {`${url}/leads`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Лиды</Link>
                <Link to = {`${url}`} style = {{margin: '10px', textDecoration: 'none',
                    fontSize: '15px', textAlign: 'center'}}>Заказы</Link>  
            </div> */}

            

            <div style = {{display: 'flex', flexDirection: 'column', width: '80%'}}>
                <MainInfoComponent />
                <FilterRequestsComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot} />
                {/* <FunnelComponent updatePlot = {updatePlot}/> */}
                <TrafficTable updatePlot = {updatePlot}/>
                <Switch>
                    <Route exact path = {path}>
                        {/* <OrderComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/> */}
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