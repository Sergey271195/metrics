import React, {useState} from 'react'
import { TrafficSources } from '../../PlotUtils'
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent'
import CurrentYearOrderPlotComponent from './CurrentYearOrderPlotComponent'
import PredictionPlot from './PredictionPlot'

import '../../../styles/ComparePlot.css'

const OrderPredictionPlotContainer = ({updatePlot}) => {

    const [ traffic, setTraffic ] = useState(TrafficSources)
    const [plotType, setPlotType] = useState('Purchases')

    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div className = 'comapreByMonthTitle'>Заказы по месяцам</div>
            <div style = {{display: 'flex'}}>  
                <CurrentYearOrderPlotComponent traffic = {traffic} plotType = {plotType} setPlotType = {setPlotType}/>     
                    <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>
            
            <div className = 'comapreByMonthTitle'>Прогноз по выручке на (//TODO)</div>
            <PredictionPlot updatePlot = {updatePlot} traffic = {traffic} plotType = {plotType}/>
        </div>
    )
}

export default OrderPredictionPlotContainer
