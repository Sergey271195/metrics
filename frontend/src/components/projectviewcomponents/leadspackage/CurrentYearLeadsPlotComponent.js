import React, {useState, useEffect, useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import { getCurrentYearStart, formatDate, MONTH_DICTIONARY } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, timeTrafficReducer, trafficReducer, TrafficSources } from '../../PlotUtils'

const CurrentYearLeadsPlotComponent = ({goals, currentGoal, setCurrentGoal, traffic}) => {

    const { views } = useContext(ViewsContext)
    const [ dataForTheYear, setDataForTheYear ] = useState()
    const [ filteredData, setFilteredData ] = useState()
    
    const currMonth = new Date().getMonth()

    const project = views.project.data

    const changeGoal = (event) => {
        
    }

    useEffect(() => {
        if (!traffic) return 
        if (!dataForTheYear) return
        console.log('setting Filtered data')
        const sources = trafficReducer(traffic)
        setFilteredData(timeTrafficReducer(dataForTheYear, sources))
    }, [dataForTheYear, traffic])

    useEffect(() => {
        if (!currentGoal) return

        const data = {
            date1: formatDate(getCurrentYearStart()),
            date2: formatDate(new Date()),
            jandexid: project.webpage.jandexid,
            curr_goal_id: currentGoal.jandexid,
        }
        
        PostFetch(`api/jandexdata/goals/reaches/month`, data)
            .then(data => {
                console.log('fetching Raw year data')
                setDataForTheYear(data.data)
            })
    }, [currentGoal])

    useEffect(() => {
        if (!currentGoal) return
        if (!filteredData) return
        const ctx = clearPlot("GoalsByMonthChart", "chartWrapperGoals")
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: MONTH_DICTIONARY.slice(0, currMonth+1),
                responsive: true,
                datasets: [{
                    label: currentGoal.name,
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
            <select onChange = {(event) => setCurrentGoal(goals[event.target.value])}>
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
