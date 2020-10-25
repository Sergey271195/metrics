import React from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { RounderN } from '../../Utils'
import '../../../styles/TrafficTable.css'

export const CountPercents = (num1, num2) => {
    if (!num1 || !num2) {
        return num1 > num2 ? <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 100%</div> 
        : <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> 100%</div>
    }
    if (num1 === num2 && num1 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 0%</div>
    if (num1 === 0) return <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> 100%</div>
    if (num2 === 0) return <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> 100%</div>
    return Math.abs(num1) >= Math.abs(num2) 
    ? <div className = 'trafficTablePercentsUp'><IoMdArrowDropup /> {String(RounderN((100 - 100*(num2/num1)), 1))+ '%'}</div> 
    : <div className = 'trafficTablePercentsDown'><IoMdArrowDropdown /> {String(RounderN((100 - 100*(num1/num2)), 1)) + '%'}</div>
}

