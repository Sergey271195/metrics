import React, { useContext, useState, useEffect } from 'react'
import { CurrentWebPageContext } from '../context/CurrentWebPageContext'
import { TokenContext } from '../context/TokenContext'
import { GETFetch, GETFetchAuth } from './Utils'


/* managment = requests.get(f'https://api-metrika.yandex.net/management/v1/counter/{alleri_id}/goals', headers = {
    "Authorization": f"OAuth {token}"
})

goals_ids = [entry.get('id') for entry in managment.json().get('goals')]
goals_names = [entry.get('name') for entry in managment.json().get('goals')]
for a,b in zip(goals_ids, goals_names):
    print(a, b) */

const CurrentPageComponent = () => {

    const { currentPage } = useContext(CurrentWebPageContext)
    const { token } = useContext(TokenContext)
    const [goals, setGoals] = useState()
    const {loading, data, error} = GETFetchAuth(`https://api-metrika.yandex.net/management/v1/counter/${currentPage.id}/goals`, token)
    
    
    useEffect(() => {
        if (!data) return;
        setGoals(data.goals)
    })

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
        <div style = {{fontSize: '30px', fontWeight: 'bold'}}>{currentPage.name}</div>
        {goals && goals.map(goal => {
            return(<div key = {goal.id}>{goal.name}</div>)
        })
        }
        </div>
    )


}

export default CurrentPageComponent