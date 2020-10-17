import React, {useState, useEffect, useContext} from 'react'
import { PostFetch } from '../../Utils'
import { ViewsContext } from '../../../context/ViewsContext'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import CompareLeadsComponent from './CompareLeadsComponent'
import LeadsPlotComponent from './LeadsPlotComponent'
import CurrentYearLeadsPlotComponent from './CurrentYearLeadsPlotComponent'
import GoalsPredictionPlotComponent from './GoalsPredictionPlotComponent'

const LeadsComponent = ({updatePlot, goals, setGoals}) => {

    const { views } = useContext(ViewsContext)

    const [ currentGoalsData, setCurrentGoalsData ] = useState()
    const [ previousGoalsData, setPreviousGoalsData ] = useState()
    const [ currentGoal, setCurrentGoal ] = useState()

    useEffect(() => {
        if (!goals) return
        setCurrentGoal(goals[0])
    }, [goals])

    const { timePeriod: {
                firstPeriod,
                secondPeriod,
                filterParam
            }} = useContext(DataForPlotsContext)

    const project = views.project.data

    useEffect(() => {

        
        fetch(`api/goals/get/${project.webpage.jandexid}`)
            .then(response => response.json())
                .then(data => setGoals(data))
                    .catch(error => console.log(error))

    }, [project])

    useEffect(() => {
        /* Info for the first part of time period */
        if (!goals) return
        if (!firstPeriod) return
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid,
            traffic_source: filterParam.sourceTraffic
        }
        PostFetch('api/jandexdata/goals/reaches', data)
            .then(data => {
                setCurrentGoalsData(data.map(entry =>{
                return (entry.totals[0])}))
            })
            .catch(error => console.log(error))
    }, [goals, updatePlot, filterParam])

    useEffect(() => {
        /* Info for the second part of time period */
        if (!goals) return
        if (!secondPeriod) return
        const data = {
            date1: secondPeriod.start,
            date2: secondPeriod.end,
            jandexid: project.webpage.jandexid,
            traffic_source: filterParam.sourceTraffic
        }
        PostFetch('api/jandexdata/goals/reaches', data)
            .then(data => {
                setPreviousGoalsData(data.map(entry =>{
                return (entry.totals[0])}))
            })
            .catch(error => console.log(error))
    }, [goals, updatePlot, filterParam])

    return (
        <>
        <div style = {{diplay: 'flex', flexDirection: 'row', marginTop: '100px'}}>
            <h1>Лиды</h1>
            <LeadsPlotComponent goals = {goals}
                 currentGoalsData = {currentGoalsData} />
            <CompareLeadsComponent goals = {goals}
                 currentGoalsData = {currentGoalsData} previousGoalsData = {previousGoalsData}/>
        </div>
        <div>
            <h1>Лиды по месяцам</h1>
            {goals && <CurrentYearLeadsPlotComponent goals = {goals} currentGoal = {currentGoal} setCurrentGoal = {setCurrentGoal}/>}
        </div>
        <div>
            <h1>Прогноз по лидам (//TODO)</h1>
            {currentGoal && <GoalsPredictionPlotComponent currentGoal = {currentGoal} updatePlot = {updatePlot}/>}
        </div>
        </>
    )
}

export default LeadsComponent
