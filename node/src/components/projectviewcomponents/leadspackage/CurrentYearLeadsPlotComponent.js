import React, {useState, useEffect, useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import { getCurrentYearStart, formatDate, MONTH_DICTIONARY } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, trafficReducer, allDataRedcuer, allDataAggregator } from '../../PlotUtils'

const CurrentYearLeadsPlotComponent = ({goals, currentGoalIndex, setCurrentGoalIndex, traffic}) => {

    const { views } = useContext(ViewsContext)
    const [ dataForTheYear, setDataForTheYear ] = useState()
    const [ filteredData, setFilteredData ] = useState()
    const [ title, setTitle ] = useState()

    const currMonth = new Date().getMonth()

    const project = views.project.data

    useEffect(() => {
        if (!dataForTheYear) return
        const sources = trafficReducer(traffic)
        const filtered = allDataRedcuer(dataForTheYear, sources)
        if (currentGoalIndex == -1) {
            setFilteredData(allDataAggregator(filtered))
            setTitle('Общие данные')
        } else {
            setFilteredData(filtered[currentGoalIndex])
            setTitle(goals[currentGoalIndex].name)
        }
    }, [currentGoalIndex, dataForTheYear, traffic])

    useEffect(() => {

        const data = {
            date1: formatDate(getCurrentYearStart()),
            date2: formatDate(new Date()),
            jandexid: project.webpage.jandexid
        }
        
        PostFetch(`api/jandexdata/goals/reaches/month/all`, data)
            .then(data => {
                setDataForTheYear(data)
            })
    }, [goals])

    useEffect(() => {
        if (!filteredData) return
        const ctx = clearPlot("GoalsByMonthChart", "chartWrapperGoals")
        if (!ctx) return
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                responsive: true,
                datasets: [{
                    label: title,
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
        <>
        {goals && <div style = {{marginBottom: '100px'}}>
        <div style = {{display: 'flex'}}>
            <select onChange = {(event) => {
                setCurrentGoalIndex(event.target.value)
            }}>
                <option value = {-1}>Все</option>
                {goals.map((goal, index) => {
                    return(
                        <option key = {goal.id} value = {index}>{goal.name}</option>
                    )
                })}
            </select>
        </div>
        <div style = {{display: 'flex'}}>
            <div className = 'chartWrapperGoals' style = {{width: '600px', height: '250px'}}>
                <canvas id = "GoalsByMonthChart" ></canvas>
            </div>
        </div>
        </ div>}
        </>
    )
}
export default CurrentYearLeadsPlotComponent
