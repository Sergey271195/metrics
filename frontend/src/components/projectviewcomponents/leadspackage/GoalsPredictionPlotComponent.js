import React, {useEffect, useState, useContext} from 'react'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch } from '../../Utils'
import { previousMonthSameDate, formatDate } from '../../Date'
import Chart from 'chart.js';
import { clearPlot, formatDatePeriods, trafficReducer, dataAggregator, allDataRedcuer, allDataAggregator } from '../../PlotUtils'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'


const GoalsPredictionPlotComponent = ({goals, updatePlot, traffic, currentGoalIndex}) => {

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

    const [ plotTitle, setPlotTitle ] = useState()
    const [ timePeriods, setTimePeriods ] = useState()

    useEffect(() => {
        if (!currentDataByDays) return
        const sources = trafficReducer(traffic)
        const filteredData1 = currentDataByDays ? allDataRedcuer(currentDataByDays, sources): [[0]]
        const filteredData2 = previousDataByDays ? allDataRedcuer(previousDataByDays, sources): [[0]]
        const filteredData3 = previousYearDataByDays ? allDataRedcuer(previousYearDataByDays, sources): [[0]]
        if (currentGoalIndex == -1) {
            setFilteredCurrentData(allDataAggregator(filteredData1))
            setFilteredPreviousData(allDataAggregator(filteredData2))
            setFilteredPreviousYearData(allDataAggregator(filteredData3))
            setPlotTitle('Общие данные')
        }
        else {
            setFilteredCurrentData(filteredData1[currentGoalIndex])
            setFilteredPreviousData(filteredData2[currentGoalIndex])
            setFilteredPreviousYearData(filteredData3[currentGoalIndex])
            setPlotTitle(goals[currentGoalIndex].name)
        }
    }, [previousYearDataByDays, traffic, currentGoalIndex])

    useEffect(() => {
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day/all', data)
            .then(data => {
                setCurrentDataByDays(data)
                setTimePeriods(formatDatePeriods(data[0].time_intervals))
            }).then(() => fetchPrev())
    }, [updatePlot])

    const fetchPrev = () => {
        const data = {
            date1: formatDate(previousMonthSameDate(new Date(firstPeriod.start))),
            date2: formatDate(previousMonthSameDate(new Date(firstPeriod.end))),
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day/all', data)
            .then(data => {
                setPreviousDataByDays(data)
            }).then(() => fetchPrevYear())
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
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches/day/all', data)
            .then(data => {
                setPreviousYearDataByDays(data)
            })
    }

    useEffect(() => {
        const ctx = clearPlot("GoalsPredictionPlot", "GoalsPredictionChartWrapper")
        if (!ctx) return
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timePeriods,
                responsive: true,
                datasets: [{
                    label: 'Текущий период',
                    data: dataAggregator(filteredCurrentData),
                    fill: false,
                    borderColor:'rgb(75, 192, 192)',
                    lineTension:0.2,
                },
                {
                    label: 'Предыдущий период',
                    data: dataAggregator(filteredPreviousData),
                    fill: false,
                    borderColor:'rgb(192, 75, 192)',
                    lineTension:0.1,
                },{
                    label: 'Предыдущий год',
                    data: dataAggregator(filteredPreviousYearData),
                    fill: false,
                    borderColor:'rgb(192, 192, 75)',
                    lineTension:0.1,
                }]
            },
            options: {
                title: {
                    display: true,
                    text: plotTitle
                }
            }
        });
    }, [filteredPreviousYearData, filteredCurrentData, filteredPreviousData, currentGoalIndex])

    return (
        <div className = 'GoalsPredictionChartWrapper' style = {{width: '600px', height: '250px'}}>
            <canvas id = "GoalsPredictionPlot" ></canvas>
        </div>
    )
}

export default GoalsPredictionPlotComponent
