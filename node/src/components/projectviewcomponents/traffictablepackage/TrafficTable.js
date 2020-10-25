import React, {useEffect, useContext, useState } from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch, RounderN } from '../../Utils'

import '../../../styles/TrafficTable.css'

const CountPercents = (num1, num2) => {
    if (!num1 || !num2) return <></>
    if (num1 === num2 && num1 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 0%</div>
    if (num1 === 0) return <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> 100%</div>
    if (num2 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 100%</div>
    return Math.abs(num1) >= Math.abs(num2) 
    ? <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> {String(RounderN((100 - 100*(num2/num1)), 1))+ '%'}</div> 
    : <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> {String(RounderN((100 - 100*(num1/num2)), 1)) + '%'}</div>
}

const TrafficTable = ({updatePlot}) => {

    const { views } = useContext(ViewsContext)
    const { timePeriod: {
        firstPeriod, secondPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ searchEngineData, setSearchEngineData ] = useState()
    const [ socialNetworkData, setSocialNetworkData ] = useState()
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
    

    useEffect(() => {
        const data = {
            date1_a: firstPeriod.start,
            date2_a: firstPeriod.end,
            date1_b: secondPeriod.start,
            date2_b: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch('/api/jandexdata/search_engine', data)
            .then(data => {
                console.log(data)
                setSearchEngineData(data)
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
        PostFetch('/api/jandexdata/social_network', data)
            .then(data => {
                console.log(data)
                setSocialNetworkData(data)
            })
    }, [updatePlot])

    return (
        <div>
            {/* HEADER */}
            <div style = {{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}>
                <div style = {{width: '25%'}}>Источники</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Визиты</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Кол-во заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Сумма заказов</div>
                <div style = {{width: '20%', marginLeft: '20px'}}>Средний чек</div>
            </div>


            {/* SEARCH ENGINE */}
            <div style = {{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}>
                <div style = {{width: '25%'}}>Переходы из поисковых систем</div>
                {searchEngineData && searchEngineData.totals['a'].map((total, index) => {
                    return (
                        <div style = {{display: 'flex', marginLeft: '20px',
                            alignItems: 'center', width: '20%'}}  key = {index}>
                            <div>{RounderN(total, 1)}</div>
                            <div style = {{marginLeft: '8px'}}>{CountPercents(total, searchEngineData.totals['b'][index])}</div>
                        </div>
                    )
                })}
            </div>
                {searchEngineData && searchEngineData.data.map(entry => {
                    return(
                        <div key = {entry.dimensions[0].name} style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                            <div style = {{width: '25%'}}>{entry.dimensions[0].name}</div>
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

            {/* SOCIAL NETWORK */}

            <div style = {{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}> 
                <div style = {{width: '25%'}}>Переходы из социальных сетей</div>
                {socialNetworkData && socialNetworkData.totals['a'].map((total, index) => {
                    return (
                        <div style = {{display: 'flex', marginLeft: '20px',
                            alignItems: 'center', width: '20%'}}  key = {index}>
                            <div>{RounderN(total, 1)}</div>
                            <div style = {{marginLeft: '8px'}}>{CountPercents(total, socialNetworkData.totals['b'][index])}</div>
                        </div>
                    )
                })}
            </div>
                {socialNetworkData && socialNetworkData.data.map(entry => {
                    return(
                        <div key = {entry.dimensions[0].name} style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                            <div style = {{width: '25%'}}>{entry.dimensions[0].name}</div>
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

            {/* OTHER SOURCES */}
            
                {allSourcesData && allSourcesData.data.map(entry => {
                    return (
                        <div key = {entry.dimensions[0].name} style = {{display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid black'}}>
                            <div style = {{width: '25%'}}>{entry.dimensions[0].name}</div>
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
