import React, {useEffect, useContext} from 'react'
import { CurrentWebPageContext } from '../context/CurrentWebPageContext'
import { TokenContext } from '../context/TokenContext'
import { ViewsContext } from '../context/ViewsContext'
//import CreateEmployeeComponent from './CreateEmployeeComponent'
//import CreateProjectComponent from './createprojectpackage/CreateProjectComponent'
//import CurrentPageComponent from './CurrentPageComponent'
//import EmployeeListComponent from './EmployeeListComponent'
//import ProjectListComponent from './projectlistpackage/ProjectListComponent'
import { GETFetch } from './Utils'
//import WebListComponent from './WebListComponent'
import MainView from './views/MainView'
import ProjectView from './views/ProjectView'
import EmployeeView from './views/EmployeeView'

const Controller = () => {

    const { setToken } = useContext(TokenContext)
    const {loading, data, error} = GETFetch('api/token')
    const { currentPage } = useContext(CurrentWebPageContext)
    const { views, dispatchViews } = useContext(ViewsContext)
    
    useEffect(() => {
        if (data) {
            setToken(data.token)
        }
    }, [data])

    if (error) return <div>Ooops. Something went wrong...</div>
    if (loading) return <div>Loading</div>
    return(
        <div style = {{display: 'flex'}}>
            {views.main.show ? 
            <MainView /> : (views.project.show ? <ProjectView />: <EmployeeView />) }
            {/* <WebListComponent />
            {currentPage && <CurrentPageComponent />} */}
        </div>
    )

}

export default Controller

{/* <CreateEmployeeComponent />
            <EmployeeListComponent />
            <CreateProjectComponent />
            <ProjectListComponent /> */}