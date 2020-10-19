import React, {useEffect, useState, useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import {previousMonthSameDate, formatDate} from '../../Date'
import Chart from 'chart.js';
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { clearPlot, dataAggregator, plotTypeDict, allDataRedcuerLight, trafficReducer } from '../../PlotUtils'

const PredictionPlot = ({updatePlot, plotType, traffic}) => {

    const { views } = useContext(ViewsContext)
    const {timePeriod: {
        firstPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ currentDataByDays, setCurrentDataByDays ] = useState()
    const [ previousDataByDays, setPreviousDataByDays ] = useState()
    const [ previousYearDataByDays, setPreviousYearDataByDays ] = useState()

    const [ filteredCurrentDataByDays, setFilteredCurrentDataByDays ] = useState()
    const [ filteredPreviousDataByDays, setFilteredPreviousDataByDays ] = useState()
    const [ filteredPreviousYearDataByDays, setFilteredPreviousYearDataByDays ] = useState()

    const [ timePeriods, setTimePeriods ] = useState()

    useEffect(() => {
        if (!currentDataByDays) return
        const sources = trafficReducer(traffic)
        const filtered1 = currentDataByDays ? 
                dataAggregator(allDataRedcuerLight(currentDataByDays, sources)[plotTypeDict[plotType].id]): [0]
        const filtered2 = previousDataByDays ? 
                dataAggregator(allDataRedcuerLight(previousDataByDays, sources)[plotTypeDict[plotType].id]): [0]
        const filtered3 = previousYearDataByDays ? 
                dataAggregator(allDataRedcuerLight(previousYearDataByDays, sources)[plotTypeDict[plotType].id]): [0]
        setFilteredCurrentDataByDays(filtered1)
        setFilteredPreviousDataByDays(filtered2)
        setFilteredPreviousYearDataByDays(filtered3)
    }, [previousYearDataByDays, currentDataByDays, previousDataByDays, traffic, plotType])

    useEffect(() => {
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        }
        PostFetch('/api/jandexdata/tasks/day', data)
            .then(data => {
                setCurrentDataByDays(data)
                setTimePeriods(data.time_intervals.map(interval => interval[0]))
            }).then(() => fetchPrev())
    }, [updatePlot])

    const fetchPrev = () => {
        const data = {
            date1: formatDate(previousMonthSameDate(new Date(firstPeriod.start))),
            date2: formatDate(previousMonthSameDate(new Date(firstPeriod.end))),
            jandexid: project.webpage.jandexid
        }
        PostFetch('/api/jandexdata/tasks/day', data)
            .then(data => {
                setPreviousDataByDays(data)
            }).then(() => fetchPrevYear())
    }

    const fetchPrevYear = () => {
        const endDate = new Date(firstPeriod.end)
        endDate.setFullYear(endDate.getFullYear()-1)

        const startDate = new Date(firstPeriod.start)
        startDate.setFullYear(startDate.getFullYear()-1)
        startDate.setDate(1)

        const data = {
            date1: formatDate(startDate),
            date2: formatDate(endDate),
            jandexid: project.webpage.jandexid
        }
        PostFetch('/api/jandexdata/tasks/day', data)
            .then(data => {
                setPreviousYearDataByDays(data)
            })
    }

    useEffect(() => {
        if (!filteredCurrentDataByDays) return
        if (!timePeriods) return
        const ctx = clearPlot("PredictionPlot", "PredictionChartWrapper")
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePeriods,
                responsive: true,
                datasets: [{
                    label: 'Текущий период',
                    data: filteredCurrentDataByDays,
                    fill: false,
                    borderColor:'rgb(75, 192, 192)',
                    lineTension:0.1,
                },
                {
                    label: 'Предыдущий период',
                    data: filteredPreviousDataByDays,
                    fill: false,
                    borderColor:'rgb(192, 75, 192)',
                    lineTension:0.1,
                },{
                    label: 'Предыдущий год',
                    data: filteredPreviousYearDataByDays,
                    fill: false,
                    borderColor:'rgb(192, 192, 75)',
                    lineTension:0.1,
                }]
            },
            options: {
                title: {
                    display: true,
                    text: plotTypeDict[plotType].label
                }
            }
        });
    }, [filteredPreviousYearDataByDays, filteredCurrentDataByDays, filteredPreviousDataByDays])

    return (
        <div className = 'PredictionChartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "PredictionPlot" ></canvas>
        </div>
    )
}

export default PredictionPlot
