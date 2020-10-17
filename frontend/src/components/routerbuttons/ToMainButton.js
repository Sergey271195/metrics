import React, { useContext } from 'react'
import { ViewsContext } from '../../context/ViewsContext'
import {
    Link
  } from "react-router-dom";

const ToMainButton = ({className}) => {

    const { dispatchViews } = useContext(ViewsContext)
    
    return(
        <Link to = '/'>
            <button className = {className} onClick = {() => dispatchViews({type: 'MAIN_VIEW'})}>На главную</button>
        </Link>
    )
}

export default ToMainButton