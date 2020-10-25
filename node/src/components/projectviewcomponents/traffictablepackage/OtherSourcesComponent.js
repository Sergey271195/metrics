import React, {useEffect, useContext, useState } from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch, RounderN } from '../../Utils'
import { CountPercents } from './CounterComponent'
import { trafficTableReducer } from '../../PlotUtils'

const OtherSourcesComponent = ({updatePlot}) => {

    const TrafficTitles = {
        'direct': 'Прямые заходы',
        'internal': "Внутренние переходы",
        'recommend': "Рекомендательные системы",
        'email': "Переходы с почтовых рассылок" 
    
    }

    const { views } = useContext(ViewsContext)
    const { timePeriod: {
        firstPeriod, secondPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ allSourcesData, setAllSourcesData ] = useState()

    const [ allSourcesGoalsData, setAllSourcesGoalsData ] = useState()

    

    useEffect(() => {
        const data = {
            date1_a: firstPeriod.start,
            date2_a: firstPeriod.end,
            date1_b: secondPeriod.start,
            date2_b: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch('/api/jandexdata/traffic_view/goals', data)
            .then(data => {
                setAllSourcesGoalsData(trafficTableReducer(data))
            })
    }, [updatePlot]) 

    useEffect(() => {
        const data = {
            date1_a: firstPeriod.start,
            date2_a: firstPeriod.end,
            date1_b: secondPeriod.start,
            date2_b: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch('/api/jandexdata/traffic_view', data)
            .then(data => {
                setAllSourcesData(data)
            })
    }, [updatePlot])  

    return (
        <>
            {allSourcesData && allSourcesGoalsData && allSourcesData.data.map(entry => {
                return (
                    <div key = {entry.dimensions[0].name} className = 'tableRow'>
                        <div className = 'firstTableCellMain'>{TrafficTitles[entry.dimensions[0].id]}</div>
                        {entry.metrics['a'].map((value, index) => {
                            return (
                                <div className = 'tableCell' key = {entry.dimensions[0].name +index}>
                                    <div style = {{flex: '0.5'}}>{value ? RounderN(value, 1): 0}</div>
                                    <div style = {{flex: '1'}}>{CountPercents(value, entry.metrics['b'][index])}</div>
                                </div>
                                )
                        })}
                        {allSourcesGoalsData[entry.dimensions[0].name] ? 
                            <div className = 'tableCell'>
                                <div style = {{flex: '0.5'}}>
                                    {allSourcesGoalsData[entry.dimensions[0].name] 
                                    ? RounderN(allSourcesGoalsData[entry.dimensions[0].name]['a'], 1): 0}
                                </div>
                                <div style = {{flex: '1'}}>
                                    {CountPercents(allSourcesGoalsData[entry.dimensions[0].name]['a'], allSourcesGoalsData[entry.dimensions[0].name]['b'])}
                                </div>
                            </div>
                            : <div className = 'tableCell'>0</div>
                        }
                    </div>
                )
            })}
        </>
    )
}

export default OtherSourcesComponent
