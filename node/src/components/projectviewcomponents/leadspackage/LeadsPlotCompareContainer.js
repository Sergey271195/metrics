import React, { useEffect, useState } from 'react'
import { groupTrafficReducer, trafficReducer, TrafficSources } from '../../PlotUtils';
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent';
import CompareLeadsComponent from './CompareLeadsComponent';
import LeadsPlotComponent from './LeadsPlotComponent';

const LeadsPlotCompareContainer = ({goals, currentGoalsData, previousGoalsData}) => {

    const [ currentFilteredData, setCurrentFilteredData ] = useState(currentGoalsData)
    const [ previousFilteredData, setPreviousFilteredData ] = useState(previousGoalsData)
    const [ traffic, setTraffic ] = useState(TrafficSources)

    useEffect(() => {
        if (!traffic) return
        if (!currentGoalsData) return
        const sources = trafficReducer(traffic)
        setCurrentFilteredData(
                groupTrafficReducer(currentGoalsData, sources)
        )
    }, [traffic, currentGoalsData])

    useEffect(() => {
        if (!traffic) return
        if (!previousGoalsData) return
        const sources = trafficReducer(traffic)
        setPreviousFilteredData(
            groupTrafficReducer(previousGoalsData, sources)
        )
    }, [traffic, previousGoalsData])

    return (
        <div style = {{dipslay: 'flex', flexDirection: 'row'}}>
            <h1>Лиды</h1>
            <div style = {{display: 'flex', flexDirection: 'row'}}>
                <LeadsPlotComponent goals = {goals} currentFilteredData = {currentFilteredData}/>
                <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>
            <CompareLeadsComponent goals = {goals}
                 currentFilteredData = {currentFilteredData} previousFilteredData = {previousFilteredData}/>
        </div>
    )
}

export default LeadsPlotCompareContainer
