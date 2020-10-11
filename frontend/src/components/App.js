import React from 'react'
import { render } from "react-dom";
import Contoller from './Controller'
import TokenContextProvider from '../context/TokenContext'
import WebListContextProvider from '../context/WebListContext';
import CurrentWebPageContextProvider from '../context/CurrentWebPageContext'
import EmployeeContextProvider from '../context/EmployeeContext';
import ProjectsContextProvider from '../context/ProjectsContext'
import ViewsContextProvider from '../context/ViewsContext';
import DateForPlotsContextProvider from '../context/DateForPlotsContext';


const App = () => {
    return(
        <TokenContextProvider>
            <WebListContextProvider>
                <CurrentWebPageContextProvider>
                    <EmployeeContextProvider>
                        <ProjectsContextProvider>
                            <ViewsContextProvider>
                                <DateForPlotsContextProvider>
                                    <Contoller />
                                </DateForPlotsContextProvider>
                            </ViewsContextProvider>
                        </ProjectsContextProvider>
                    </EmployeeContextProvider>
                </CurrentWebPageContextProvider>
            </WebListContextProvider>
        </TokenContextProvider>
    )
}

export default App

const app = document.getElementById("app")
render(<App />, app)