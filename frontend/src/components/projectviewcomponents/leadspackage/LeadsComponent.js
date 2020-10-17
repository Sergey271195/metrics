import React, {useState, useEffect, useContext} from 'react'
import { GETFetchAuthV, PostFetch } from '../../Utils'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
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

    console.log(goals)
    console.log(views.project.data)

    useEffect(() => {
        if (!goals) return
        setCurrentGoal(goals[0])
    }, [goals])

    const { timePeriod: {
                firstPeriod,
                secondPeriod
            }} = useContext(DataForPlotsContext)

    const JandexManage = 'https://api-metrika.yandex.net/management/v1/counter'
    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    console.log("GOALS")
    console.log(goals)

    useEffect(() => {
        if (!goals) return
        if (!firstPeriod) return
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches', data)
            .then(data => {
                console.log('DATA'),
                console.log(data)
            })
            .catch(error => console.log(error))
    })

    useEffect(() => {

        /* Info for the first part of time period */
        fetch(`api/goals/get/${project.webpage.jandexid}`)
            .then(response => response.json())
                .then(data => {console.log(data),  setGoals(data)})
                    .catch(error => console.log(error))

    }, [project])

    useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.jandexid}reaches
&date1=${firstPeriod.start}
&date2=${firstPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            setCurrentGoalsData(data.map(entry =>{
                console.log(entry.data[0])
                return (entry.totals[0])}))
        })
    }, [goals, updatePlot])

    useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.jandexid}reaches
&date1=${secondPeriod.start}
&date2=${secondPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => setPreviousGoalsData(data.map(entry =>{return (entry.totals[0])})))
    }, [goals, updatePlot])

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
