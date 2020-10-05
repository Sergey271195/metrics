import React from 'react'
import { render } from "react-dom";
import Contoller from './Controller'
import TokenContextProvider from '../context/TokenContext'
import WebListContextProvider from '../context/WebListContext';
import CurrentWebPageContextProvider from '../context/CurrentWebPageContext'


const App = () => {
    return(
        <TokenContextProvider>
            <WebListContextProvider>
                <CurrentWebPageContextProvider>
                    <Contoller />
                </CurrentWebPageContextProvider>
            </WebListContextProvider>
        </TokenContextProvider>
    )
}

export default App

const app = document.getElementById("app")
render(<App />, app)