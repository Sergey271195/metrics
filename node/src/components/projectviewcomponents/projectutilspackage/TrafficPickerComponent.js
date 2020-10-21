import React, { useContext, useState } from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { TrafficSources } from '../../PlotUtils'

const TrafficPickerComponent = () => {

    const [ traffic, setTraffic ] = useState('all')

    const { setTimePeriod } = useContext(DataForPlotsContext)

    const changeTrafficSource = (event) => {
        setTraffic(event.target.value)
        setTimePeriod({type: 'CHANGE_TRAFFIC_SOURCE', data: event.target.value})
    }

    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <h3  style = {{margin:'10px'}}>Источники трафика</h3>
            <select value = {traffic} onChange = {(event) => changeTrafficSource(event)}>
                <option value = 'all'>all</option>
                {TrafficSources.map(source => {
                    return <option key = {source.id} value = {source.id}>{source.name}</option>
                })}
            </select>
        </div>
    )
}

export default TrafficPickerComponent
