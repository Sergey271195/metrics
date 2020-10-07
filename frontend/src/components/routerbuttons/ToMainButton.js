import React, { useContext } from 'react'
import { ViewsContext } from '../../context/ViewsContext'

const ToMainButton = ({className}) => {

    const { dispatchViews } = useContext(ViewsContext)
    
    return(
        <button className = {className} onClick = {() => dispatchViews({type: 'MAIN_VIEW'})}>На главную</button>
    )
}

export default ToMainButton