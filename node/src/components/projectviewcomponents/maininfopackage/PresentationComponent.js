import React, {useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'

const PresentationComponent = () => {

    const { views } = useContext(ViewsContext)
    const project = views.project.data

    return (
        <div style = {{display: 'flex'}}>
            <div className = 'webLogo' >
                Logo
            </div>
            <div style = {{display: 'flex', flexDirection: 'column', marginLeft: '40px'}}>
                <div className = 'webTitle'>{project.webpage.name}</div>
                <div className = 'webpageType'>{project._type}</div>
                <a className = 'webpageLink' href = {`https://${project.webpage.url}`} target = "_blank">{project.webpage.url}</a>
            </div>
        </div>
    )
}

export default PresentationComponent
