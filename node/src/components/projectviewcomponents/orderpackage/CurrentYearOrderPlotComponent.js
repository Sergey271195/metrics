import React, { useEffect, useContext, useState } from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import { getCurrentYearStart, formatDate, MONTH_DICTIONARY } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, trafficReducer, plotTypeDict } from '../../PlotUtils'
import BoxComponent from '../../utilcomponents/BoxComponent';

Chart.defaults.global.defaultFontFamily = "FuturaPT"
Chart.defaults.global.legend.display = false

const CurrentYearOrderPlotComponent = ({traffic, plotType, setPlotType}) => {

    const [ dataForTheYear, setDataForTheYear ] = useState()
    const [ filteredData, setFilteredData ] = useState()

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

            var bar_ctx = ctx.getContext('2d');
            var background_1 = bar_ctx.createLinearGradient(0, 0, 0, 400);
            background_1.addColorStop(1, 'white');
            background_1.addColorStop(0, '#FFD000');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                    datasets: [{
                        label: plotTypeDict[plotType].label,
                        data: filteredData.slice(0, currMonth+1),
                        borderWidth: 1,
                        backgroundColor: background_1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
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
                                display: false,
                                drawBorder: false
                            }
                        }],
                    }
                }
            });
        }, [filteredData])


    return (
        <div style = {{display: 'flex', width: '70%', flexDirection: 'column'}}>
            <div style = {{display: 'flex', width: '100%', justifyContent: 'space-between', marginBottom: '20px'}}>
                <button className = {'byMonthPlotBtn' + (plotTypeDict[plotType].label == 'Количество' ? ' active': '')}
                    onClick = {() => setPlotType('Purchases')}>Количество</button>
                <button className = {'byMonthPlotBtn' + (plotTypeDict[plotType].label == 'Общая сумма' ? ' active': '')}
                    onClick = {() => setPlotType('TotalSum')}>Общая сумма</button>
                <button className = {'byMonthPlotBtn' + (plotTypeDict[plotType].label == 'Средний чек' ? ' active': '')} 
                    onClick = {() => setPlotType('SumPerPurchase')}>Средний чек</button>
            </div>
            <BoxComponent size = {{padding: '30px', height: '250px'}}>
                <div className = 'OrdersByMonthChartWrapper' style = {{position: 'relative', width: '100%', height: '100%'}}>
                    <canvas id = "OdersByMonthChart"></canvas>
                </div>
            </BoxComponent>
            
        </ div>
    )
}

export default CurrentYearOrderPlotComponent
