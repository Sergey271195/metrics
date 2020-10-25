import React, {useEffect, useContext, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch, RounderN } from '../../Utils'

import '../../../styles/TrafficTable.css'
import SourceTemplateComponent from './SourceTemplateComponent'

const CountPercents = (num1, num2) => {
    if (!num1 || !num2) return <></>
    if (num1 === num2 && num1 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 0%</div>
    if (num1 === 0) return <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> 100%</div>
    if (num2 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 100%</div>
    return Math.abs(num1) >= Math.abs(num2) 
    ? <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> {String(RounderN((100 - 100*(num2/num1)), 1))+ '%'}</div> 
    : <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> {String(RounderN((100 - 100*(num1/num2)), 1)) + '%'}</div>
}

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
                console.log(data)
                setAllSourcesData(data)
            })
    }, [updatePlot])
    

    return (
        <div>
            {/* HEADER */}
            <div style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                <div style = {{width: '25%'}}>Источники</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Визиты</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Кол-во заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Сумма заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Средний чек</div>
            </div>

            <SourceTemplateComponent updatePlot = {updatePlot} CountPercents = {CountPercents}
                url = {'search_engine'} title = {'Переходы из поисковых систем'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} CountPercents = {CountPercents}
                url = {'social_network'} title = {'Переходы из социальных сетей'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} CountPercents = {CountPercents}
                url = {'adv_engine'} title = {'Переходы по рекламе'}/>
            <SourceTemplateComponent updatePlot = {updatePlot} CountPercents = {CountPercents}
                url = {'referal_source'} title = {'Переходы по ссылкам на сайтах'}/>
            
                {allSourcesData && allSourcesData.data.map(entry => {
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
                        </div>
                    )
                })}
        </div>
    )
}

export default TrafficTable
