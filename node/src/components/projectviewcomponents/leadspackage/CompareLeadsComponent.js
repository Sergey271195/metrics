import React from 'react'
import { RounderN } from '../../Utils'

const CompareLeadsComponent = ({goals, currentFilteredData, previousFilteredData}) => {

    const CountPercents = (num1, num2) => {
        if (num1 === num2 && num1 === 0) return `+ 0%`
        return num1 >= num2 ? ('+ '+ String(RounderN((100 - 100*(num2/num1)), 2))+ '%') 
        : ('- ' + String(RounderN((100 - 100*(num1/num2)), 2)) + '%')
    }

    return (
        <div>
            {currentFilteredData && previousFilteredData && goals.map((item, index) => {
                return(
                    <div key = {item.jandexid} style = {{border: '1px solid black', width: '50%'}}>
                        <div style = {{marginBottom: '5px', marginTop: '5px'}}>{index + 1}) {item.name}</div>
                        <div style = {{display: 'flex'}}>
                            <div style = {{marginRight: '30px'}}>{currentFilteredData[index]}</div>
                            <div style = {{marginRight: '30px'}}>{previousFilteredData[index]}</div>
                            <div>{CountPercents(currentFilteredData[index], previousFilteredData[index])}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CompareLeadsComponent
