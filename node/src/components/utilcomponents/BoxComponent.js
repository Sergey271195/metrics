import React from 'react'
import '../../styles/Box.css'

const BoxComponent = (props) => {
    return (
        <div className = 'box' style = {{...props.size}}>
            {props.children}
        </div>
    )
}

export default BoxComponent
