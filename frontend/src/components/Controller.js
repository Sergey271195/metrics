import React, {useEffect, useContext} from 'react'
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import { CurrentWebPageContext } from '../context/CurrentWebPageContext'
import { TokenContext } from '../context/TokenContext'
import { ViewsContext } from '../context/ViewsContext'
import { GETFetch } from './Utils'
import MainView from './views/MainView'
import ProjectView from './views/ProjectView'
import EmployeeView from './views/EmployeeView'
import { EmployeeContext } from '../context/EmployeeContext';
import ProjectListView from './views/ProjectListView';



const Controller = () => {

    const { setToken } = useContext(TokenContext)
    const {loading, data, error} = GETFetch('api/token')
    const { dispatchEmployee } = useContext(EmployeeContext) 
    
    useEffect(() => {
        fetch('api/employee/getall')
        .then(response => response.json())
            .then(data => dispatchEmployee({type: 'FETCH', data: data}))
                .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        if (data) {
            setToken(data.token)
        }
    }, [data])

    if (error) return <div>Ooops. Something went wrong...</div>
    if (loading) return <div>Loading</div>
    return(
        <Router>

            <nav style = {{display:'flex', backgroundColor: 'grey', width: '100%', marginBottom: '20px',
                height: '50px', padding: '5px', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <h1>Metrics</h1>
                <Link to = "/">
                    <button>Главная</button>
                </Link>
                <Link to = "/employee"><button>Сотрудники</button></Link>
                <Link to = "/project"><button>Проекты</button></Link>
            </nav>

            <div style = {{display: 'flex'}}>
                <Switch>
                    <Route path = "/project/:id">
                        <ProjectView />
                    </Route>
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