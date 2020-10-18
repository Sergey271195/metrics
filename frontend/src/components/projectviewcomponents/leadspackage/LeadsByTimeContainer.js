import React, { useEffect, useState } from 'react'
import { TrafficSources } from '../../PlotUtils'
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent'
import CurrentYearLeadsPlotComponent from './CurrentYearLeadsPlotComponent'
import GoalsPredictionPlotComponent from './GoalsPredictionPlotComponent'

const LeadsByTimeContainer = ({goals, updatePlot}) => {

    const [ currentGoal, setCurrentGoal ] = useState()
    const [ traffic, setTraffic ] = useState(TrafficSources)

    useEffect(() => {
        if (!goals) return
        setCurrentGoal(goals[0])
    }, [goals])

    return (
        <>  
            <h1>Лиды по месяцам</h1>
            {currentGoal && 
            <div style = {{display: 'flex'}}>
                <CurrentYearLeadsPlotComponent 
                    goals = {goals} currentGoal = {currentGoal} setCurrentGoal = {setCurrentGoal} traffic = {traffic}/>
                <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>}
            <div>
                <h1>Прогноз по лидам (//TODO)</h1>
                {currentGoal &&  <GoalsPredictionPlotComponent currentGoal = {currentGoal}
                    updatePlot = {updatePlot} traffic = {traffic}/>}
            </div>
        </>
    )
}

export default LeadsByTimeContainer
