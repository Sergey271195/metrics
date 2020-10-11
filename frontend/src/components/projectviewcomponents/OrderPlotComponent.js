import React, { useEffect } from 'react'
import Chart from 'chart.js';

const OrderPlotComponent = ({dataFirstPart}) => {

    const ORDER_DICTIONARY = ['Перешли на сайт', 'Добавление в корзину (unique)', "Добавлено в корзину", "Заказы", "Общая сумма заказов", "Средний чек"]

    useEffect(() => {
        if (!dataFirstPart) return
        const ctx = document.getElementById("MyChart")
        new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: ORDER_DICTIONARY.slice(1, 4),
                responsive: true,
                datasets: [{
                    label: 'Статистика по заказам',
                    data: dataFirstPart.slice(1, 4),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
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
    }, [dataFirstPart])


    return (
        /* Chart render */
        <div className = 'chartWrapper' style = {{width: '400px', height: '250px', marginRight: '100px'}}>
            <canvas id = "MyChart" ></canvas>
        </div>
    )
}

export default OrderPlotComponent
