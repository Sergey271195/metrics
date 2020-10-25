import React, {useState, useEffect, useContext} from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { trafficReducer, TrafficSources } from '../../PlotUtils'
import { PostFetch } from '../../Utils'
import TrafficSourceCheckboxComponent from '../projectutilspackage/TrafficSourceCheckboxComponent'
import CompareComponent from './CompareComponent'
import OrderPlotComponent from './OrderPlotComponent'

const filterData = (data, sources) => {
    return data.filter(item => sources.includes(item.dimensions[0].id))
    .reduce((acc, entry) => {
        if (acc.length === 0) {
            return entry.metrics
        }
        else {
            return entry.metrics.map((it, index) => {
                return acc[index] + it
            })
        }
    }, [])
}

const OrderPlotCompareContainer = ({updatePlot}) => {

    const [ currentFilteredData, setCurrentFilteredData ] = useState()
    const [ previousFilteredData, setPreviousFilteredData ] = useState()

    const [ dataFirstPart, setDataFirstPart ] = useState()
    const [ dataSecondPart, setDataSecondPart ] = useState()

    const [ traffic, setTraffic ] = useState(TrafficSources)

    const { timePeriod: {
        firstPeriod,
        secondPeriod
    }} = useContext(DataForPlotsContext)

    const { views } = useContext(ViewsContext)
    const project = views.project.data

    useEffect(() => {
        if (!dataFirstPart) return
        const sources = trafficReducer(traffic)
        if (sources.length == 8) {
            setCurrentFilteredData(dataFirstPart.totals)
        }
        else {
            setCurrentFilteredData(
                filterData(dataFirstPart.data, sources)
            )
        }
    }, [traffic, dataFirstPart])

    useEffect(() => {
        if (!dataSecondPart) return
        const sources = trafficReducer(traffic)
        if (sources.length == 8) {
            setPreviousFilteredData(dataSecondPart.totals)
        }
        else {
            setCurrentFilteredData(
                filterData(dataSecondPart.data, sources)
            )
        }
    }, [traffic, dataSecondPart])

    useEffect(() => {
        if (!project.webpage) return
        PostFetch('api/jandexdata/tasks/general', {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid,
        })
            .then(data => {
                setDataFirstPart(data)})

        PostFetch('api/jandexdata/tasks/general', {
            date1: secondPeriod.start,
            date2: secondPeriod.end,
            jandexid: project.webpage.jandexid,
        })
            .then(data => setDataSecondPart(data))

    }, [updatePlot, project.webpage])

    return (
        <div>
            <div style = {{display: 'flex'}}>
                <OrderPlotComponent currentFilteredData = {currentFilteredData} />
                <TrafficSourceCheckboxComponent traffic = {traffic} setTraffic = {setTraffic}/>
            </div>
            <CompareComponent currentFilteredData = {currentFilteredData} previousFilteredData = {previousFilteredData} />
        </div>
    )
}

export default OrderPlotCompareContainer
