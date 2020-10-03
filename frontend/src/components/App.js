import React from 'react'
import { render } from "react-dom";

const App = () => {
    return(
        <div>
            React Template
        </div>
    )
}

export default App

const app = document.getElementById("app")
render(<App />, app)