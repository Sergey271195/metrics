import React, {useEffect, useState, useContext} from 'react'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import { GETFetchAuthV } from '../Utils'
import { currentDate, startOfCurrentMonth,
        previousMonthSameDate, startPreviousMonth, formatDate,
        MONTH_DICTIONARY } from '../Date'
import Chart from 'chart.js';

const PredictionPlot = () => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const JandexStatByTime = 'https://api-metrika.yandex.net/stat/v1/data/bytime?'
    const project = views.project.data

    const [ currentDataByDays, setCurrentDataByDays ] = useState()
    const [ previousDataByDays, setPreviousDataByDays ] = useState()
    const [ previousYearDataByDays, setPreviousYearDataByDays ] = useState()
    const [ timePeriods, setTimePeriods ] = useState()

    const formatDatePeriods = (data) => {
        setTimePeriods(data.map(item => {
            return item[0].substring(8, 10) + item[0].substring(4, 7)
        }))
    }  

    const aggregateData = (data) => {
        let aggregator = 0
        const aggData =  data.map(item => {
            aggregator+=item
            return aggregator
        })
        return aggregator == 0 ? [] : aggData
    }

    useEffect(() => {
/* Current period */
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${formatDate(startOfCurrentMonth())}
&date2=${formatDate(currentDate())}`, token)
        .then(response => response.json())
            .then(data => {
                setCurrentDataByDays(aggregateData(data.data[0].metrics[0])),
                formatDatePeriods(data.time_intervals)
            })
                .catch(error => console.log(error))

    }, [])

    useEffect(() => {
        /* Previous period */
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${formatDate(startPreviousMonth(currentDate()))}
&date2=${formatDate(previousMonthSameDate(currentDate()))}`, token)
        .then(response => response.json())
            .then(data => {
                console.log(data),
                setPreviousDataByDays(aggregateData(data.data[0].metrics[0]))
            })
                .catch(error => console.log(error))

        }, [])

        useEffect(() => {
            /* Previous year */
        
            const endDate = new Date()
            endDate.setFullYear(endDate.getFullYear()-1)

            const startDate = new Date()
            startDate.setFullYear(startDate.getFullYear()-1)
            startDate.setDate(1)

GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=day
&metrics=ym:s:ecommerceRevenue
&date1=${formatDate(startDate)}
&date2=${formatDate(endDate)}`, token)
        .then(response => response.json())
            .then(data => {
                console.log(data),
                setPreviousYearDataByDays(aggregateData(data.data[0].metrics[0]))
            })
                .catch(error => console.log(error))
    
            }, [])

    useEffect(() => {
        if (!currentDataByDays) return
        if (!previousDataByDays) return
        if (!timePeriods) return
        console.log(previousYearDataByDays)
        const ctx = document.getElementById("PredictionPlot")
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
        <div className = 'chartWrapper2' style = {{width: '600px', height: '250px'}}>
            <canvas id = "PredictionPlot" ></canvas>
        </div>
    )
}

export default PredictionPlot
