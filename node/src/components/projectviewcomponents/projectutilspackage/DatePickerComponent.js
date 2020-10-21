import React, { useContext } from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'

const DatePickerComponent = ({ updatePlot, setUpdatePlot }) => {

    const { timePeriod: {
        firstPeriod,
        secondPeriod
    },
        setTimePeriod } = useContext(DataForPlotsContext)

    const fetchNewData = (event) => {
        event.preventDefault()
        if (new Date(firstPeriod.start) - new Date(firstPeriod.end) > 0) return
        if (new Date(secondPeriod.start) - new Date(secondPeriod.end) > 0) return
        setUpdatePlot(!updatePlot)
    }

    return (
        <div style = {{marginRight: '50px'}}>
            <form onSubmit = {(event) => fetchNewData(event)} style = {{display: 'flex', flexDirection: 'column'}}>

                <div>Первый период</div>
                <div style = {{display: 'flex'}}>
                    <input defaultValue = {firstPeriod.start} type = 'date' placeholder = 'Начало первого периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_FIRST_START', data: event.target.value})}/>
                        <div> - </div>
                    <input defaultValue = {firstPeriod.end} type = 'date' placeholder = 'Окончание первого периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_FIRST_END', data: event.target.value})}/>
                </div>
                
                <div>Второй период</div>
                <div style = {{display: 'flex'}}>
                    <input value = {secondPeriod.start} type = 'date' placeholder = 'Начало второго периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_SECOND_START', data: event.target.value})}/>
                        <div> - </div>
                    <input value = {secondPeriod.end} type = 'date' placeholder = 'Окончание второго периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_SECOND_END', data: event.target.value})}/>
                </div>

                <button>Сравнить периоды</button>

            </form>
        </div>
    )
}

export default DatePickerComponent
