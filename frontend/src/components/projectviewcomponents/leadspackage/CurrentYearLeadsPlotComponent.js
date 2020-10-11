import React, {useState, useEffect, useContext} from 'react'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { GETFetchAuthV } from '../../Utils'
import { getCurrentYearStart, formatDate, MONTH_DICTIONARY } from '../../Date'
import Chart from 'chart.js';
import { clearPlot } from '../../PlotUtils'

const CurrentYearLeadsPlotComponent = ({goals}) => {

    const [ currentGoal, setCurrentGoal ] = useState()

    useEffect(() => {
        if (!goals) return
        setCurrentGoal(goals[0])
    }, [goals])

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const [ dataForTheYear, setDataForTheYear ] = useState([].fill(0, 0, 12))
    const currMonth = new Date().getMonth()

    const JandexStatByTime = 'https://api-metrika.yandex.net/stat/v1/data/bytime?'
    const project = views.project.data

    useEffect(() => {
    if (!currentGoal) return
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=month
&metrics=ym:s:goal${currentGoal.id}reaches
&date1=${formatDate(getCurrentYearStart())}
&date2=${formatDate(new Date())}`, token)
            .then(response => response.json())
                .then(data => setDataForTheYear(data.data[0].metrics[0]))
                    .catch(error => console.log(error))
        }, [currentGoal])

        useEffect(() => {
            if (!currentGoal) return
GETFetchAuthV(`${JandexStatByTime}id=${project.webpage.jandexid}&group=month
&metrics=ym:s:goal${currentGoal.id}revenue
&date1=${formatDate(getCurrentYearStart())}
&date2=${formatDate(new Date())}`, token)
            .then(response => response.json())
                .then(data => console.log(data.data[0].metrics[0]))
                    .catch(error => console.log(error))
        }, [currentGoal])


    useEffect(() => {
        if (!currentGoal) return
        const ctx = clearPlot("GoalsByMonthChart", "chartWrapperGoals")
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                responsive: true,
                datasets: [{
                    label: currentGoal.name,
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
        {goals && <div style = {{marginBottom: '100px'}}>
        <div style = {{display: 'flex'}}>
            <select onChange = {(event) => {console.log(event.target.value), setCurrentGoal(goals[event.target.value])}}>
                {goals.map((goal, index) => {
                    return(
                        <option key = {goal.id} value = {index}>{goal.name}</option>
                    )
                })}
            </select>
        </div>
        <div className = 'chartWrapperGoals' style = {{width: '600px', height: '250px'}}>
            <canvas id = "GoalsByMonthChart" ></canvas>
        </div>
        </ div>}
        </>
    )
}
export default CurrentYearLeadsPlotComponent
