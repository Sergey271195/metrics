import React, { useContext, useEffect, useState } from 'react'
import { ViewsContext } from '../../context/ViewsContext'

const ProjectOptionsView = ({ goals, setGoals }) => {

    const { views } = useContext(ViewsContext)
    const project = views.project.data

    const [ allGoals, setAllGoals ] = useState()
    

    useEffect(() => {
        fetch(`api/goals/get/all/${project.webpage.jandexid}`)
            .then(response => response.json())
                .then(data => {
                    console.log(data),
                    setAllGoals(data)
                })
    }, [project])

    const deactivateGoal = (id) => {
        fetch(`api/goals/disable/${id}`)
            .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.STATUS_CODE == 200) {
                        setGoals(goals.filter(goal => goal.id != id))
                        setAllGoals(allGoals.map(item => {
                            if (item.id == id) {
                                return {...item, active: false}
                            }
                            return item
                        }))
                    }
                })
    }

    const activateGoal = (goal) => {
        fetch(`api/goals/enable/${goal.id}`)
            .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.STATUS_CODE == 200) {
                        setGoals([...goals, goal])
                    }
                    setAllGoals(allGoals.map(item => {
                        if (item.id == goal.id) {
                            return {...item, active: true}
                        }
                        return item
                    }))
                })
        
    }


    if (!allGoals) return <></>
    return (
        <div>
            {allGoals.map(item => {
                console.log(item)
                return(
                    <div key = {item.id} style = {{display: 'flex', flexDirection: 'column'}}>
                        <div style = {{display: 'flex'}}>
                            <div>{item.name}</div>
                            {item.active ? 
                            <button onClick = {() => deactivateGoal(item.id)} style = {{color: 'green'}}>Deactivate</button>
                            : <button onClick = {() => activateGoal(item)} style = {{color: 'red'}}>Activate</button>}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ProjectOptionsView
