import React, { useState } from 'react'
import ToMainButton from '../routerbuttons/ToMainButton'
import OrderComponent from '../projectviewcomponents/OrderComponent'
import LeadsComponent from '../projectviewcomponents/leadspackage/LeadsComponent'

const ProjectView = () => {

    const [ updatePlot, setUpdatePlot ] = useState(true)

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div style = {{display: 'flex'}}>
                <div style  = {{marginLeft: '20px'}}>Заказы</div>
            </div>
            
            <div style = {{display: 'flex', flexDirection: 'column'}}>
                <OrderComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/>
                <LeadsComponent updatePlot = {updatePlot}/>
            </div>
        </div>
    )
}

export default ProjectView