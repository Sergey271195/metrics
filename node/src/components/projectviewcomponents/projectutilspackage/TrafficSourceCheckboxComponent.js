import React, { useState } from 'react'
import { TrafficSources } from '../../PlotUtils'

const CheckComponent = ({source, traffic, setTraffic}) => {

    const [ x, setX ] = useState(true)

    const onCheck = (event) => {
        setTraffic(traffic.map(item => {
            return item.id === source.id ? {...item, show: event.target.checked} : item
        }))
        setX(event.target.checked)
    }


    return (
        <div>
            <input type = 'checkbox' checked = {x} value = {source.id} onChange = {(event) => onCheck(event)} />
            <label>{source.name}</label>
        </div>
    )

}

const TrafficSourceCheckboxComponent = ({ traffic, setTraffic }) => {

    if (!traffic) return <></>
    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <h3  style = {{margin:'10px'}}>Источники трафика</h3>
                {TrafficSources.map(source => {
                    return (
                    <CheckComponent key = {source.id} source = {source} traffic = {traffic} setTraffic = {setTraffic}/>
                    )
                })}
        </div>
    )
}

export default TrafficSourceCheckboxComponent
