import React from 'react'
import { RounderN } from '../../Utils'

const CompareLeadsComponent = ({goals, currentGoalsData, previousGoalsData}) => {

    const CountPercents = (num1, num2) => {
        if (num1 === num2 && num1 === 0) return `+ 0%`
        return num1 >= num2 ? ('+ '+ String(RounderN((100 - 100*(num2/num1)), 2))+ '%') 
        : ('- ' + String(RounderN((100 - 100*(num1/num2)), 2)) + '%')
    }

    return (
        <div>
            {currentGoalsData && previousGoalsData && goals.map((item, index) => {
                return(
                    <div key = {item.id}>
                        <div style = {{marginBottom: '5px', marginTop: '5px'}}>{index + 1}) {item.name}</div>
                        <div style = {{display: 'flex'}}>
                            <div style = {{marginRight: '30px'}}>{currentGoalsData[index]}</div>
                            <div style = {{marginRight: '30px'}}>{previousGoalsData[index]}</div>
                            <div>{CountPercents(currentGoalsData[index], previousGoalsData[index])}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CompareLeadsComponent
