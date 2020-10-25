import React, {useEffect, useState, useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import {previousMonthSameDate, formatDate} from '../../Date'
import Chart from 'chart.js';
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { clearPlot, dataAggregator, plotTypeDict, allDataRedcuerLight, trafficReducer, RussMonthDict } from '../../PlotUtils'
import BoxComponent from '../../utilcomponents/BoxComponent';

Chart.defaults.global.defaultFontFamily = "FuturaPT"
Chart.defaults.global.legend.display = false

const formatToRussMonth = (data) => {
    return data.map(date => {
        const dt = new Date(date)
        const day = dt.getDate()
        const month = RussMonthDict[dt.getMonth()+1]
        return `${day} ${month}`
    })
}

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

        var bar_ctx = ctx.getContext('2d');
        var background_1 = bar_ctx.createLinearGradient(0, 0, 0, 300);
        background_1.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        background_1.addColorStop(0, 'rgba(20, 255, 0, 0.5)');

        var background_2 = bar_ctx.createLinearGradient(0, 0, 0, 300);
        background_2.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        background_2.addColorStop(0, 'rgba(255, 208, 0, 0.5)');

        var background_3 = bar_ctx.createLinearGradient(0, 0, 0, 300);
        background_3.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        background_3.addColorStop(0, 'rgba(255, 46, 0, 0.5)');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: formatToRussMonth(timePeriods),
                datasets: [{
                    label: 'Текущий период',
                    data: filteredCurrentDataByDays,
                    fill: true,
                    backgroundColor: background_1,
                    borderColor:'#1A9F1F',
                    lineTension:0.1,
                },
                {
                    label: 'Предыдущий период',
                    data: filteredPreviousDataByDays,
                    fill: true,
                    borderColor:'#FDD835',
                    backgroundColor: background_2,
                    lineTension:0.1,
                },{
                    label: 'Предыдущий год',
                    data: filteredPreviousYearDataByDays,
                    fill: true,
                    borderColor:'#FF0000',
                    backgroundColor: background_3,
                    lineTension:0.1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 0
                    },
                    line: {
                        cubicInterpolationMode: true,
                    }
                },
                title: {
                    display: true,
                    text: plotTypeDict[plotType].label
                },
                scales: {
                    ticks: {
                        
                    },
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#1F1F1F",
                        },
                        gridLines: {
                            borderDash: [8, 30]
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: "#1F1F1F",
                        },
                        gridLines: {
                            display: true,
                            drawBorder: false
                        }
                    }],
                }
            }
        });
    }, [filteredPreviousYearDataByDays, filteredCurrentDataByDays, filteredPreviousDataByDays])

    return (
        <BoxComponent size = {{padding: '30px', height: '300px', width: '92%', marginBottom: '50px'}}>
            <div className = 'PredictionChartWrapper' style = {{width: '100%', height: '300px'}}>
                <canvas id = "PredictionPlot" ></canvas>
            </div>
        </BoxComponent>
    )
}

export default PredictionPlot
