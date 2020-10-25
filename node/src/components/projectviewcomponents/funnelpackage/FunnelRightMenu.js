import React from 'react'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'
import { RounderN } from '../../Utils'

import '../../../styles/Funnel.css'


const CountPercents = (num1, num2) => {
    if (num1 === num2 && num1 === 0) return <div><IoMdArrowDropup /> 0%</div>
    return Math.abs(num1) >= Math.abs(num2) 
    ? <div className = 'rightMenuPercentsUp'><IoMdArrowDropup /> {String(RounderN((100 - 100*(num2/num1)), 1))+ '%'}</div> 
    : <div className = 'rightMenuPercentsDown'><IoMdArrowDropdown /> {String(RounderN((100 - 100*(num1/num2)), 1)) + '%'}</div>
}

const FunnelRightMenu = ({funnelData, funnelDataPrev}) => {

    return (
        <>{funnelData && funnelDataPrev && <>
                <div className = 'rightMenuTitle'>Заказы:</div>
                <div className = 'rightMenuValue'>{funnelData[3]} {CountPercents(funnelData[3], funnelDataPrev[3])}</div>
                
                <div className = 'rightMenuTitle'>Общая сумма:</div>
                <div className = 'rightMenuValue'>{funnelData[5]} {CountPercents(funnelData[5], funnelDataPrev[5])}</div>

                <div className = 'rightMenuTitle'>Средний чек:</div>
                <div className = 'rightMenuValue'>{RounderN(funnelData[6], 1)} {CountPercents(funnelData[6], funnelDataPrev[6])}</div>
            </>}
        </>
    )
}

export default FunnelRightMenu
