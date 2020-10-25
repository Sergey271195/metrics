import React, {useEffect, useContext, useState } from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch, RounderN } from '../../Utils'

import '../../../styles/TrafficTable.css'
import SourceTemplateComponent from './SourceTemplateComponent'
import { CountPercents } from './CounterComponent'
import { trafficTableReducer } from '../../PlotUtils'
import BoxComponent from '../../utilcomponents/BoxComponent'

const TrafficTitles = {
    'direct': 'Прямые заходы',
    'internal': "Внутренние переходы",
    'recommend': "Рекомендательные системы",
    'email': "Переходы с почтовых рассылок" 

}

const TrafficTable = ({updatePlot}) => {

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

    console.log(allSourcesGoalsData)

    return (
        <BoxComponent>
            {/* HEADER */}
            <div style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                <div style = {{width: '25%'}}>Источники</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Визиты</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Кол-во заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Сумма заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Средний чек</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Лиды</div>
            </div>

            <SourceTemplateComponent updatePlot = {updatePlot} 
                url = {'search_engine'} title = {'Переходы из поисковых систем'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} 
                url = {'social_network'} title = {'Переходы из социальных сетей'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} 
                url = {'adv_engine'} title = {'Переходы по рекламе'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} 
                url = {'referal_source'} title = {'Переходы по ссылкам на сайтах'}/>
            
                {allSourcesData && allSourcesGoalsData && allSourcesData.data.map(entry => {
                    return (
                        <div key = {entry.dimensions[0].name} style = {{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}>
                            <div style = {{width: '25%'}}>{TrafficTitles[entry.dimensions[0].id]}</div>
                            {entry.metrics['a'].map((value, index) => {
                                return (
                                    <div style = {{display: 'flex', marginLeft: '20px',
                                        alignItems: 'center', width: '20%'}} key = {entry.dimensions[0].name +index}>
                                        <div>{value ? RounderN(value, 1): 0}</div>
                                        <div style = {{marginLeft: '8px'}}>{CountPercents(value, entry.metrics['b'][index])}</div>
                                    </div>
                                    )
                            })}
                            {allSourcesGoalsData[entry.dimensions[0].name] ? 
                                <div style = {{display: 'flex', marginLeft: '20px',
                                    alignItems: 'center', width: '20%'}}>
                                    <div>{allSourcesGoalsData[entry.dimensions[0].name] 
                                        ? RounderN(allSourcesGoalsData[entry.dimensions[0].name]['a'], 1): 0}
                                    </div>
                                    <div style = {{marginLeft: '8px'}}>
                                        {CountPercents(allSourcesGoalsData[entry.dimensions[0].name]['a'], allSourcesGoalsData[entry.dimensions[0].name]['b'])}
                                    </div>
                                </div>
                                : <div style = {{display: 'flex', marginLeft: '20px',
                                        alignItems: 'center', width: '20%'}}>
                                        0
                            </div>}
                        </div>
                    )
                })}
        </BoxComponent>
    )
}

export default TrafficTable
