import React, {useState, useEffect, useContext} from 'react'
import { PostFetch } from '../../Utils'
import { ViewsContext } from '../../../context/ViewsContext'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import LeadsPlotCompareContainer from './LeadsPlotCompareContainer'
import LeadsByTimeContainer from './LeadsByTimeContainer'

const LeadsComponent = ({updatePlot, goals, setGoals}) => {

    const { views } = useContext(ViewsContext)

    const [ currentGoalsData, setCurrentGoalsData ] = useState()
    const [ previousGoalsData, setPreviousGoalsData ] = useState()

    const { timePeriod: {
                firstPeriod,
                secondPeriod
            }} = useContext(DataForPlotsContext)

    const project = views.project.data

    useEffect(() => {

        fetch(`api/goals/get/${project.webpage.jandexid}`)
            .then(response => response.json())
                .then(data => setGoals(data))
                    .catch(error => console.log(error))

    }, [project.webpage.jandexid])

    useEffect(() => {
        /* Info for the first part of time period */
        if (!goals) return
        if (!firstPeriod) return
        console.log('fetching first part')
        const data = {
            date1: firstPeriod.start,
            date2: firstPeriod.end,
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches', data)
            .then(data => {
                setCurrentGoalsData(data)
            }).then(setTimeout(fetchSecondHalf, 1000))
            .catch(error => console.log(error))
    }, [goals, updatePlot])

    const fetchSecondHalf = () => {
        /* Info for the second part of time period */
        if (!goals) return
        if (!secondPeriod) return
        console.log('fetching second part')
        const data = {
            date1: secondPeriod.start,
            date2: secondPeriod.end,
            jandexid: project.webpage.jandexid
        }
        PostFetch('api/jandexdata/goals/reaches', data)
            .then(data => {
                setPreviousGoalsData(data)
            })
            .catch(error => console.log(error))
    }

    return (
        <>
            <LeadsPlotCompareContainer goals = {goals} currentGoalsData = {currentGoalsData} previousGoalsData = {previousGoalsData} />
            <LeadsByTimeContainer goals = {goals} updatePlot = {updatePlot} />
        </>
    )
}

export default LeadsComponent
