import React, { useEffect, useContext, useState } from 'react'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import { GETFetchAuthV } from '../Utils'
import { getCurrentYearStart, formatDate } from '../Date'
import Chart from 'chart.js';

const CurrentYearOrderPlotComponent = () => {

    const MONTH_DICTIONARY = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
        "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

    const [plotType, setPlotType] = useState('Purchases')

    const plotTypeDict = {
        'Purchases': {
            label: 'Количество',
            request: 'ym:s:ecommercePurchases'
        },
        'TotalSum': {
            label: 'Общая сумма',
            request: 'ym:s:ecommerceRevenue'
        },
        'SumPerPurchase': {
            label: 'Средний чек',
            request: 'ym:s:ecommerceRevenuePerPurchase'
        }
    }

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const [ dataForTheYear, setDataForTheYear ] = useState([].fill(0, 0, 12))
    const currMonth = new Date().getMonth()

    const JandexStatByTime = 'https://api-metrika.yandex.net/stat/v1/data/bytime?'
    const project = views.project.data

    useEffect(() => {

GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=month
&metrics=${plotTypeDict[plotType].request}
&date1=${formatDate(getCurrentYearStart())}
&date2=${formatDate(new Date())}`, token)
            .then(response => response.json())
                .then(data => setDataForTheYear(data.data[0].metrics[0]))
                    .catch(error => console.log(error))
        }, [plotType])


        useEffect(() => {
                const ctx = document.getElementById("OdersByMonthChart")
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                        responsive: true,
                        datasets: [{
                            label: plotTypeDict[plotType].label,
                            data: dataForTheYear.slice(0, currMonth+1),
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
            }, [dataForTheYear])


    return (
        <>
        <div style = {{display: 'flex'}}>
            <button onClick = {() => setPlotType('Purchases')}>Количество</button>
            <button onClick = {() => setPlotType('TotalSum')}>Общая сумма</button>
            <button onClick = {() => setPlotType('SumPerPurchase')}>Средний чек</button>
        </div>
        <div className = 'chartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "OdersByMonthChart" ></canvas>
        </div>
        </>
    )
}

export default CurrentYearOrderPlotComponent
