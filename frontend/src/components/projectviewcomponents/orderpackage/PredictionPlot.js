import React, {useEffect, useState, useContext} from 'react'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { GETFetchAuthV } from '../../Utils'
import {previousMonthSameDate, formatDate} from '../../Date'
import Chart from 'chart.js';
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { clearPlot, formatDatePeriods, aggregateData } from '../../PlotUtils'

const PredictionPlot = ({updatePlot}) => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)
    const {timePeriod: {
        firstPeriod
    }} = useContext(DataForPlotsContext)

    const JandexStatByTime = 'https://api-metrika.yandex.net/stat/v1/data/bytime?'
    const project = views.project.data

    const [ currentDataByDays, setCurrentDataByDays ] = useState()
    const [ previousDataByDays, setPreviousDataByDays ] = useState()
    const [ previousYearDataByDays, setPreviousYearDataByDays ] = useState()
    const [ timePeriods, setTimePeriods ] = useState()

    useEffect(() => {
/* Current period */
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${firstPeriod.start}
&date2=${firstPeriod.end}`, token)
        .then(response => response.json())
            .then(data => {
                setCurrentDataByDays(aggregateData(data.data[0].metrics[0])),
                setTimePeriods(formatDatePeriods(data.time_intervals))
            })
                .catch(error => console.log(error))

    }, [updatePlot])

    useEffect(() => {
        /* Previous period */
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${formatDate(previousMonthSameDate(new Date(firstPeriod.start)))}
&date2=${formatDate(previousMonthSameDate(new Date(firstPeriod.end)))}`, token)
        .then(response => response.json())
            .then(data => {
                setPreviousDataByDays(aggregateData(data.data[0].metrics[0]))
            })
                .catch(error => console.log(error))

        }, [updatePlot])

        useEffect(() => {
            /* Previous year */
        
            const endDate = new Date(firstPeriod.end)
            endDate.setFullYear(endDate.getFullYear()-1)

            const startDate = new Date(firstPeriod.start)
            startDate.setFullYear(startDate.getFullYear()-1)
            startDate.setDate(1)

GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${formatDate(startDate)}
&date2=${formatDate(endDate)}`, token)
        .then(response => response.json())
            .then(data => {
                setPreviousYearDataByDays(aggregateData(data.data[0].metrics[0]))
            })
                .catch(error => console.log(error))
    
            }, [updatePlot])

    useEffect(() => {
        if (!currentDataByDays) return
        if (!previousDataByDays) return
        if (!timePeriods) return
        const ctx = clearPlot("PredictionPlot", "PredictionChartWrapper")
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePeriods,
                responsive: true,
                datasets: [{
                    label: 'Текущий период',
                    data: currentDataByDays,
                    fill: false,
                    borderColor:'rgb(75, 192, 192)',
                    lineTension:0.1,
                },
                {
                    label: 'Предыдущий период',
                    data: previousDataByDays,
                    fill: false,
                    borderColor:'rgb(192, 75, 192)',
                    lineTension:0.1,
                },{
                    label: 'Предыдущий год',
                    data: previousYearDataByDays,
                    fill: false,
                    borderColor:'rgb(192, 192, 75)',
                    lineTension:0.1,
                }]
            },
        });
    }, [currentDataByDays, timePeriods, previousDataByDays, previousYearDataByDays])

    return (
        <div className = 'PredictionChartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "PredictionPlot" ></canvas>
        </div>
    )
}

export default PredictionPlot
