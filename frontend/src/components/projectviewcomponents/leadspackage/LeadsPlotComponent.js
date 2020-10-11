import React, { useEffect } from 'react'
import Chart from 'chart.js';
import { clearPlot } from '../../PlotUtils';

const LeadsPlotComponent = ({goals, currentGoalsData}) => {

    useEffect(() => {
        if (!currentGoalsData) return
        const names = goals.map(goal => {
            return goal.name
        })
        const ctx = clearPlot("LeadsPlotComponent", "LeadsChartWrapper")
        new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: names,
                responsive: true,
                datasets: [{
                    label: 'Лиды',
                    data: currentGoalsData,
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
    }, [currentGoalsData])


    return (
        /* Chart render */
        <div className = 'LeadsChartWrapper' style = {{width: '800px', height: '400px', marginLeft: '100px'}}>
            <canvas id = "LeadsPlotComponent" ></canvas>
        </div>
    )
}

export default LeadsPlotComponent
