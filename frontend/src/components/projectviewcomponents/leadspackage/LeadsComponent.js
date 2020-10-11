import React, {useState, useEffect, useContext} from 'react'
import { GETFetchAuthV } from '../../Utils'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { DateForPlotsContext } from '../../../context/DateForPlotsContext'
import CompareLeadsComponent from './CompareLeadsComponent'
import LeadsPlotComponent from './LeadsPlotComponent'
import CurrentYearLeadsPlotComponent from './CurrentYearLeadsPlotComponent'
import GoalsPredictionPlotComponent from './GoalsPredictionPlotComponent'

const LeadsComponent = ({updatePlot}) => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const [ goals, setGoals ] = useState()
    const [ currentGoalsData, setCurrentGoalsData ] = useState()
    const [ previousGoalsData, setPreviousGoalsData ] = useState()
    const [ currentGoal, setCurrentGoal ] = useState()

    useEffect(() => {
        if (!goals) return
        setCurrentGoal(goals[0])
    }, [goals])

    const { timePeriod: {
                firstPeriod,
                secondPeriod
            }} = useContext(DateForPlotsContext)

    const JandexManage = 'https://api-metrika.yandex.net/management/v1/counter'
    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    useEffect(() => {

        /* Info for the first part of time period */
        GETFetchAuthV(`${JandexManage}/${project.webpage.jandexid}/goals`, token)
            .then(response => response.json())
                .then(data => setGoals(data.goals))
                    .catch(error => console.log(error))

    }, [project])

    useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.id}reaches
&date1=${firstPeriod.start}
&date2=${firstPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => setCurrentGoalsData(data.map(entry =>{return (entry.totals[0])})))
    }, [goals, updatePlot])

    useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.id}reaches
&date1=${secondPeriod.start}
&date2=${secondPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => setPreviousGoalsData(data.map(entry =>{return (entry.totals[0])})))
    }, [goals, updatePlot])

    return (
        <>
        <div style = {{diplay: 'flex', flexDirection: 'row', marginTop: '100px'}}>
            <LeadsPlotComponent goals = {goals}
                 currentGoalsData = {currentGoalsData} />
            <CompareLeadsComponent goals = {goals}
                 currentGoalsData = {currentGoalsData} previousGoalsData = {previousGoalsData}/>
        </div>
        <div>
            {goals && <CurrentYearLeadsPlotComponent goals = {goals} currentGoal = {currentGoal} setCurrentGoal = {setCurrentGoal}/>}
        </div>
        <div>
            {currentGoal && <GoalsPredictionPlotComponent currentGoal = {currentGoal} updatePlot = {updatePlot}/>}
        </div>
        </>
    )
}

export default LeadsComponent
