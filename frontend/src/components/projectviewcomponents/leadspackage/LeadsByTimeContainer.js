import React, { useEffect, useState } from 'react'
import { TrafficSources } from '../../PlotUtils'
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent'
import CurrentYearLeadsPlotComponent from './CurrentYearLeadsPlotComponent'
import GoalsPredictionPlotComponent from './GoalsPredictionPlotComponent'

const LeadsByTimeContainer = ({goals, updatePlot}) => {

    const [ currentGoalIndex, setCurrentGoalIndex ] = useState(-1)
    const [ traffic, setTraffic ] = useState(TrafficSources)

    return (
        <>  
            <h1>Лиды по месяцам</h1>
            <div style = {{display: 'flex'}}>
                <CurrentYearLeadsPlotComponent currentGoalIndex = {currentGoalIndex}
                    goals = {goals} setCurrentGoalIndex = {setCurrentGoalIndex} traffic = {traffic}/>
                <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>
            <div>
                <h1>Прогноз по лидам (//TODO)</h1>
                <GoalsPredictionPlotComponent goals = {goals} currentGoalIndex = {currentGoalIndex}
                    updatePlot = {updatePlot} traffic = {traffic}/>
            </div>
        </>
    )
}

export default LeadsByTimeContainer
