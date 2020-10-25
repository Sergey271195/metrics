import React, { useContext, useEffect, useState } from 'react'
import { BsCircle, BsCheckCircle } from 'react-icons/bs'
import { PostFetch, RounderN } from '../../Utils'
import { TrafficSourcesDict } from '../../PlotUtils'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'


const TrafficCheckbox = ({dimensions, traffic, setTraffic}) => {

    const onCheck = () => {
        setTraffic(
            {...traffic, [dimensions.id]: {...traffic[dimensions.id], show: !traffic[dimensions.id].show}}
        )
    }


    return (
        <>{traffic[dimensions.id].show 
            ? <BsCheckCircle style = {{marginRight: '5px'}} onClick = {() => onCheck()}/> 
            : <BsCircle style = {{marginRight: '5px'}} onClick = {() => onCheck()}/>}
        </>
    )
}


const TrafficElementComponent = ({dimensions, metrics, totals, traffic, setTraffic}) => {

    return (
        <div className = 'funnelTrafficElementContainer'>
            <div className = 'funnelTrafficSource'>{TrafficSourcesDict[dimensions.id].label}</div>
            <div className = 'funnelMetrcis'>{metrics}</div>
            <div className = 'funnelPercent'>
                <TrafficCheckbox traffic = {traffic} setTraffic = {setTraffic} dimensions = {dimensions}/>
                {RounderN((metrics/totals)*100, 1)} %
            </div>
        </div>
    )

}

const TrafficRowComponent = ({updatePlot, traffic, setTraffic}) => {

    const { views } = useContext(ViewsContext)
    const project = views.project.data

    const [ firstPeriodViews, setFirstPeriodViews ] = useState()

    const { timePeriod: {
        firstPeriod
    }} = useContext(DataForPlotsContext)

    useEffect(() => {
        if (!project) return
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch("/api/jandexdata/views", data)
            .then(data => {
                setFirstPeriodViews(data)
            }).catch(error => console.log(error))
    }, [updatePlot, project.webpage.jandexid])

    return (
        <div style ={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}} >
            {firstPeriodViews && firstPeriodViews.data.map(entry => {
                return <TrafficElementComponent key ={entry.dimensions[0].id} dimensions = {entry.dimensions[0]}
                    metrics = {entry.metrics[0]} totals = {firstPeriodViews.totals[0]} traffic = {traffic}
                    setTraffic = {setTraffic}/>
            })}
        </div>
    )
}

export default TrafficRowComponent
