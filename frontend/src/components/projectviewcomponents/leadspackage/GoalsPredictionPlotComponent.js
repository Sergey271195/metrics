import React, {useEffect, useState, useContext} from 'react'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { GETFetchAuthV, PostFetch } from '../../Utils'
import { previousMonthSameDate, formatDate } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, formatDatePeriods, aggregateData, trafficReducer, timeTrafficReducer, dataAggregator } from '../../PlotUtils'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'

const GoalsPredictionPlotComponent = ({currentGoal, updatePlot, traffic}) => {

    const { views } = useContext(ViewsContext)

    const {timePeriod: {
        firstPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ currentDataByDays, setCurrentDataByDays ] = useState()
    const [ filteredCurrentData, setFilteredCurrentData ] = useState()

    const [ previousDataByDays, setPreviousDataByDays ] = useState()
    const [ filteredPreviousData, setFilteredPreviousData ] = useState()

    const [ previousYearDataByDays, setPreviousYearDataByDays ] = useState()
    const [ filteredPreviousYearData, setFilteredPreviousYearData ] = useState()

    const [ timePeriods, setTimePeriods ] = useState()

    useEffect(() => {
        if (!previousYearDataByDays) return
        console.log('filtering')
        const sources = trafficReducer(traffic)
        console.log(sources)
        if (sources.length == 8) {
            console.log('Not filtering')
            const filtered1 = dataAggregator(currentDataByDays.totals[0])
            const filtered2 = dataAggregator(previousDataByDays.totals[0])
            const filtered3 = dataAggregator(previousYearDataByDays.totals[0])
            console.log(filtered1)
            console.log(filtered2)
            console.log(filtered3)
            setFilteredCurrentData(filtered1)
            setFilteredPreviousData(filtered2)
            setFilteredPreviousYearData(filtered3)
        }
        else {
            console.log('Actually filtering')
            const filtered1 = dataAggregator(timeTrafficReducer(currentDataByDays.data, sources))
            const filtered2 = dataAggregator(timeTrafficReducer(previousDataByDays.data, sources))
            const filtered3 = dataAggregator(timeTrafficReducer(previousYearDataByDays.data, sources))
            setFilteredCurrentData(filtered1)
            setFilteredPreviousData(filtered2)
            setFilteredPreviousYearData(filtered3)
        }
    }, [previousYearDataByDays, traffic])

    useEffect(() => {
        if (!currentGoal) return
        if (!firstPeriod) return
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid,
            curr_goal_id: currentGoal.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day', data)
            .then(data => {
                console.log('entry')
                console.log(data)
                setCurrentDataByDays(data)
                setTimePeriods(formatDatePeriods(data.time_intervals))
            }).then(() => fetchPrev())
            .catch(error => console.log(error))
    }, [currentGoal, updatePlot])

    const fetchPrev = () => {
        const data = {
            date1: formatDate(previousMonthSameDate(new Date(firstPeriod.start))),
            date2: formatDate(previousMonthSameDate(new Date(firstPeriod.end))),
            jandexid: project.webpage.jandexid,
            curr_goal_id: currentGoal.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day', data)
            .then(data => {
                console.log('entry2')
                console.log(data)
                setPreviousDataByDays(data)
            }).then(() => fetchPrevYear())
            .catch(error => console.log(error))
    }

    const fetchPrevYear = () => {
        const endDate = new Date(firstPeriod.end)
        endDate.setFullYear(endDate.getFullYear()-1)

        const startDate = new Date(firstPeriod.start)
        startDate.setFullYear(startDate.getFullYear()-1)
        startDate.setDate(1)

        const data = {
            date1: formatDate(startDate),
            date2: formatDate(endDate),
            jandexid: project.webpage.jandexid,
            curr_goal_id: currentGoal.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day', data)
            .then(data => {
                console.log('entry3')
                setPreviousYearDataByDays(data)
            })
            .catch(error => console.log(error))
        }

    useEffect(() => {
        /* if (!currentDataByDays) return
        if (!previousDataByDays) return
        if (!timePeriods) return */
        const ctx = clearPlot("GoalsPredictionPlot", "GoalsPredictionChartWrapper")
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePeriods,
                responsive: true,
                datasets: [{
                    label: 'Текущий период',
                    data: filteredCurrentData,
                    fill: false,
                    borderColor:'rgb(75, 192, 192)',
                    lineTension:0.1,
                },
                {
                    label: 'Предыдущий период',
                    data: filteredPreviousData,
                    fill: false,
                    borderColor:'rgb(192, 75, 192)',
                    lineTension:0.1,
                },{
                    label: 'Предыдущий год',
                    data: filteredPreviousYearData,
                    fill: false,
                    borderColor:'rgb(192, 192, 75)',
                    lineTension:0.1,
                }]
            },
            options: {
                title: {
                    display: true,
                    text: currentGoal.name
                }
            }
        });
    }, [filteredCurrentData])

    return (
        <div className = 'GoalsPredictionChartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "GoalsPredictionPlot" ></canvas>
        </div>
    )
}

export default GoalsPredictionPlotComponent
