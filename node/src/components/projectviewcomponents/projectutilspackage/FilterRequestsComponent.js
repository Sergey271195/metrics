import React from 'react'
import BoxComponent from '../../utilcomponents/BoxComponent'
import { FiDownload } from 'react-icons/fi'
import DatePickerComponent from './DatePickerComponent'
import '../../../styles/FilterComponent.css'

const FilterRequestsComponent = ({updatePlot, setUpdatePlot}) => {    

    return (
        <div style = {{display: 'flex', alignItems: 'center', padding: '5px', justifyContent: 'space-between'}}>
                <DatePickerComponent updatePlot = {updatePlot} setUpdatePlot = {setUpdatePlot}/>
                <BoxComponent size = {{height: '50px', width: '200px'}}>
                    <div style = {{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <div className = 'filterTitle'>Заказы</div>
                        <div>октябрь //TODO</div>
                    </div>
                    <div className = 'filterPercent'>15%</div>
                </BoxComponent>
                <BoxComponent size = {{height: '50px', width: '200px', justifyContent: 'space-between'}}>
                    <div style = {{display: 'flex', flexDirection: 'column'}}>
                        <div className = 'filterTitle'>Лиды</div>
                        <div>октябрь //TODO</div>
                    </div>
                    <div className = 'filterPercent'>15%</div>
                </BoxComponent>
                <BoxComponent size = {{height: '15px', width: '15px', justifyContent: 'center'}}>
                    <FiDownload size = {'15px'}/>
                </BoxComponent>
                <BoxComponent size = {{height: '15px', justifyContent: 'center'}}>
                    <div>Источник трафика</div>
                </BoxComponent>
                <BoxComponent size = {{height: '15px', justifyContent: 'center'}}>
                    <div>Период</div>
                </BoxComponent>
                <BoxComponent size = {{height: '15px', justifyContent: 'center'}}>
                    <div>+</div>
                </BoxComponent>
                
        </div>
    )
}

export default FilterRequestsComponent
