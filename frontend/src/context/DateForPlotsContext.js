import React, { useReducer, createContext } from 'react'
//import { getFromLocalStorage } from '../components/Utils'
import { currentDate, startOfCurrentMonth, previousMonthSameDate, startPreviousMonth, formatDate } from '../components/Date'
import { DateForPlotsReducer } from '../reducers/DateForPlotsReducer'

export const DateForPlotsContext = createContext()

const DateForPlotsContextProvider = (props) => {

    const initial_data  = {
        firstPeriod: {
            start: formatDate(startOfCurrentMonth()),
            end: formatDate(currentDate())
        },
        secondPeriod: {
            start: formatDate(startPreviousMonth(startOfCurrentMonth())),
            end: formatDate(previousMonthSameDate(currentDate()))
        }
    }

    const [ timePeriod, setTimePeriod ] = useReducer(DateForPlotsReducer, initial_data)

    return (
        <DateForPlotsContext.Provider value = {{timePeriod, setTimePeriod}}>
            {props.children}
        </DateForPlotsContext.Provider>
    )
}

export default DateForPlotsContextProvider
