import React, { useReducer, createContext } from 'react'
//import { getFromLocalStorage } from '../components/Utils'
import { currentDate, startOfCurrentMonth, previousMonthSameDate, startPreviousMonth, formatDate } from '../components/Date'
import { DataForPlotsReducer } from '../reducers/DataForPlotsReducer'

export const DataForPlotsContext = createContext()

const DataForPlotsContextProvider = (props) => {

    const initial_data  = {
        firstPeriod: {
            start: formatDate(startOfCurrentMonth()),
            end: formatDate(currentDate())
        },
        secondPeriod: {
            start: formatDate(startPreviousMonth(startOfCurrentMonth())),
            end: formatDate(previousMonthSameDate(currentDate()))
        },
        filterParam: {
            sourceTraffic: ''
        }
    }

    const [ timePeriod, setTimePeriod ] = useReducer(DataForPlotsReducer, initial_data)

    return (
        <DataForPlotsContext.Provider value = {{timePeriod, setTimePeriod}}>
            {props.children}
        </DataForPlotsContext.Provider>
    )
}

export default DataForPlotsContextProvider
