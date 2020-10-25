import React, { useState, useEffect, useContext } from 'react'
import '../../../styles/Funnel.css'
import TrafficRowComponent from './TrafficRowComponent'
import FunnelRowsComponent from './FunnelRowsComponent'
import BoxComponent from '../../utilcomponents/BoxComponent'
import FunnelRightMenu from './FunnelRightMenu'
import { ViewsContext } from '../../../context/ViewsContext'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { PostFetch } from '../../Utils'
import { TrafficSourcesDict } from '../../PlotUtils'


const pushFilter = (data, traffic) => {
    let filtered = data.reduce((acc, item) => {
        if (traffic[item.dimensions[0].id].show) {
            if (acc.length === 0) {
                return [...item.metrics]
            }
            return item.metrics.map((metric, index) => {
                return metric + acc[index]
            })
        }
        return acc
    }, [])
    filtered.push(filtered[5]/filtered[3])
    return filtered
}


const FunnelComponent = ({updatePlot}) => {

    //Visits, basketUnique, BasketQuantity, Purchases, Revenue
    const [ funnelData, setFunnelData ] = useState()
    const [ funnelDataPrev, setFunnelDataPrev ] = useState()

    const [ funnelDataFiltered, setFunnelDataFiltered ] = useState()
    const [ funnelDataPrevFiltered, setFunnelDataPrevFiltered ] = useState()

    const [ traffic, setTraffic ] = useState(TrafficSourcesDict)

    useEffect(() => {
        if (!funnelData) return
        setFunnelDataFiltered(pushFilter(funnelData, traffic))
    }, [funnelData, traffic])

    useEffect(() => {
        if (!funnelDataPrev) return
        setFunnelDataPrevFiltered(pushFilter(funnelDataPrev, traffic))
    }, [funnelDataPrev, traffic])

    const { views } = useContext(ViewsContext)
    const { timePeriod: {
        firstPeriod, secondPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    useEffect(() => {
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch("/api/jandexdata/funnel", data)
            .then(data => {
                console.log('Funnel')
                console.log(data)
                setFunnelData(data.data)
            }).then(() => fetchSecondPeriod())
            .catch(error => console.log(error))
    }, [updatePlot])

    const fetchSecondPeriod = () => {
        const data = {
            date1: secondPeriod.start,
            date2: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch("/api/jandexdata/funnel", data)
            .then(data => {
                console.log('Funnel2')
                console.log(data)
                setFunnelDataPrev(data.data)
            }).catch(error => console.log(error))
    }

    return (
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div className = 'funnelTitle'>Заказы</div>

            <div style = {{display: 'flex'}}>
                <BoxComponent size = {{width: '70%', flexDirection: 'column'}}>
                    <TrafficRowComponent updatePlot = {updatePlot} traffic = {traffic} setTraffic = {setTraffic}/>
                    <FunnelRowsComponent updatePlot = {updatePlot} 
                        funnelData = {funnelDataFiltered} funnelDataPrev = {funnelDataPrevFiltered}/>
                </BoxComponent>
                <BoxComponent size = {{width: '20%', marginLeft: '20px', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                    <FunnelRightMenu funnelData = {funnelDataFiltered} funnelDataPrev = {funnelDataPrevFiltered}/>
                </BoxComponent>
            </div>

        </div>
    )
}

export default FunnelComponent
