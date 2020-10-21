import React, { useState, useContext, useEffect } from 'react'
import OrderPlotCompareContainer from './OrderPlotCompareContainer'
import OrderPredictionPlotContainer from './OrderPredictionPlotContainer'


const OrderComponent = ({updatePlot}) => {

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <OrderPlotCompareContainer updatePlot = {updatePlot} />
            <OrderPredictionPlotContainer updatePlot = {updatePlot} />
        </div>
    )


}


export default OrderComponent
