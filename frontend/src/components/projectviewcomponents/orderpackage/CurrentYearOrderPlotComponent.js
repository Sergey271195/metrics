import React, { useEffect, useContext, useState } from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import { getCurrentYearStart, formatDate, MONTH_DICTIONARY } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, trafficReducer } from '../../PlotUtils'

const CurrentYearOrderPlotComponent = ({traffic}) => {

    const [plotType, setPlotType] = useState('Purchases')
    const [ dataForTheYear, setDataForTheYear ] = useState()
    const [ filteredData, setFilteredData ] = useState()

    const plotTypeDict = {
        'Purchases': {
            id: 0,
            label: 'Количество',
            request: 'ym:s:ecommercePurchases'
        },
        'TotalSum': {
            id: 1,
            label: 'Общая сумма',
            request: 'ym:s:ecommerceRevenue'
        },
        'SumPerPurchase': {
            id: 2,
            label: 'Средний чек',
            request: 'ym:s:ecommerceRevenuePerPurchase'
        }
    }

    const { views } = useContext(ViewsContext)

    
    const currMonth = new Date().getMonth()

    const project = views.project.data

    useEffect(() => {
        if (!dataForTheYear) return
        const sources = trafficReducer(traffic)
        const plotIndex = plotTypeDict[plotType].id
        if (sources.length == 8) {
            setFilteredData(dataForTheYear.totals[plotIndex])
        }
        else {
            setFilteredData(dataForTheYear.data.filter(item => sources.includes(item.dimensions[0].id))
                .reduce((acc, entry) => {
                    if (acc.length === 0) {
                        return entry.metrics[plotIndex]
                    }
                    else {
                        return entry.metrics[plotIndex].map((it, index) => {
                            return acc[index] + it
                        })
                    }
                }, []))
        }
    }, [traffic, plotType, dataForTheYear])

    useEffect(() => {
        PostFetch('api/jandexdata/tasks/year', {
            date1: formatDate(getCurrentYearStart()),
            date2: formatDate(new Date()),
            jandexid: project.webpage.jandexid,
        })
            .then(data => {
                setDataForTheYear(data)})
    }, [views.project.data])

        useEffect(() => {
            if (!filteredData) return
            const ctx = clearPlot("OdersByMonthChart", "OrdersByMonthChartWrapper")
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                    responsive: true,
                    datasets: [{
                        label: plotTypeDict[plotType].label,
                        data: filteredData.slice(0, currMonth+1),
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                    }
                }
            });
        }, [filteredData])


    return (
        <div style = {{marginBottom: '100px'}}>
        <div style = {{display: 'flex'}}>
            <button onClick = {() => setPlotType('Purchases')}>Количество</button>
            <button onClick = {() => setPlotType('TotalSum')}>Общая сумма</button>
            <button onClick = {() => setPlotType('SumPerPurchase')}>Средний чек</button>
        </div>
        <div className = 'OrdersByMonthChartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "OdersByMonthChart" ></canvas>
        </div>
        </ div>
    )
}

export default CurrentYearOrderPlotComponent
