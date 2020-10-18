import React, {useState} from 'react'
import { TrafficSources } from '../../PlotUtils'
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent'
import CurrentYearOrderPlotComponent from './CurrentYearOrderPlotComponent'
import PredictionPlot from './PredictionPlot'

const OrderPredictionPlotContainer = ({updatePlot}) => {

    const [ traffic, setTraffic ] = useState(TrafficSources)

    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <h1>Заказы по месяцам</h1>
            <div style = {{display: 'flex'}}>  
                <CurrentYearOrderPlotComponent traffic = {traffic}/>
                <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>
            
            <h1>Прогноз по заказам (//TODO)</h1>
            <PredictionPlot updatePlot = {updatePlot} traffic = {traffic}/>
        </div>
    )
}

export default OrderPredictionPlotContainer
