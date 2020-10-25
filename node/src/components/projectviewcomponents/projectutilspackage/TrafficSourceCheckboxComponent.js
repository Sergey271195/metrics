import React, { useState } from 'react'
import { TrafficSources } from '../../PlotUtils'
import { BsCircle, BsCheckCircle } from 'react-icons/bs'
import BoxComponent from '../../utilcomponents/BoxComponent'

import '../../../styles/TrafficSource.css'

const CheckComponent = ({source, traffic, setTraffic, index}) => {

    const onCheck = () => {
        setTraffic(traffic.map(item => {
            return item.id === source.id ? {...item, show: !item.show} : item
        }))
    }


    return (
        <div style = {{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
            {traffic[index].show 
            ? <BsCheckCircle color = '#169D00' size = '13px' onClick = {() => onCheck()}/>
            : <BsCircle color = '#169D00' size = '13px' onClick = {() => onCheck()}/>}
            <label style = {{marginLeft: '8px'}}>{source.label}</label>
        </div>
    )

}

const TrafficSourceCheckboxComponent = ({ traffic, setTraffic }) => {

    if (!traffic) return <></>
    return (
        <BoxComponent size = {{width: '20%', marginLeft: '20px', padding: '30px',
            flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'flex-start'}}>
            <div className = 'trafficSourceTitle'>Источники трафика</div>
                {TrafficSources.map((source, index) => {
                    return (
                    <CheckComponent key = {source.id} source = {source} 
                        traffic = {traffic} setTraffic = {setTraffic} index = {index}/>
                    )
                })}
        </BoxComponent>
    )
}

export default TrafficSourceCheckboxComponent
