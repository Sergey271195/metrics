import React from 'react'
import DatePickerComponent from './DatePickerComponent'

const FilterRequestsComponent = ({updatePlot, setUpdatePlot}) => {    

    return (
        <div style = {{display: 'flex', alignItems: 'center', padding: '5px'}}>
                <DatePickerComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/>
        </div>
    )
}

export default FilterRequestsComponent
