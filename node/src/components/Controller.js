import React, {useEffect, useContext} from 'react'
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import { GETFetch } from './Utils'
import MainView from './views/MainView'
import ProjectView from './views/ProjectView'
import EmployeeView from './views/EmployeeView'
import { EmployeeContext } from '../context/EmployeeContext';
import ProjectListView from './views/ProjectListView';
import NavbarComponent from './navbar/NavbarComponent';
import '../styles/Main.css'
import { StaticContext } from '../context/StaticContext';



const Controller = () => {

    const { setStaticpath } = useContext(StaticContext)
    const { dispatchEmployee } = useContext(EmployeeContext) 
    
    useEffect(() => {
        fetch('api/employee/getall')
        .then(response => response.json())
            .then(data => dispatchEmployee({type: 'FETCH', data: data}))
                .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        const app = document.getElementById("app")
        const staticpath = app.getAttribute('data-staticpath')
        setStaticpath(staticpath)
    }, [])

    return(
        <Router>
            <NavbarComponent />
            <div style = {{display: 'flex', width: '100%'}}>
                <Switch>
                    <Route path = "/project/:id" children={<ProjectView />} />
                    <Route path = "/employee">
                        <EmployeeView />
                    </Route>
                    <Route path = "/project">
                        <ProjectListView />
                    </Route>
                    <Route path = "/">
                        <MainView />
                    </Route>
                </Switch>
            </div>
        </Router>
    )

}

export default Controller