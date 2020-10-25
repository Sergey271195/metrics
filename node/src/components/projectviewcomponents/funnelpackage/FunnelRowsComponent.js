import React, { useContext } from 'react'
import { StaticContext } from '../../../context/StaticContext'
import { RounderN } from '../../Utils'

import '../../../styles/Funnel.css'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io'

const CountPercents = (num1, num2) => {
    if (num1 === num2 && num1 === 0) return <div><IoMdArrowDropup /> 0%</div>
    return Math.abs(num1) >= Math.abs(num2) 
    ? <div className = 'funnelRowsPercentsUp'><IoMdArrowDropup /> {String(RounderN((100 - 100*(num2/num1)), 1))+ '%'}</div> 
    : <div className = 'funnelRowsPercentsDown'><IoMdArrowDropdown /> {String(RounderN((100 - 100*(num1/num2)), 1)) + '%'}</div>
}

const FunnelRowsComponent = ({funnelData, funnelDataPrev}) => {



    const { staticpath } = useContext(StaticContext)

    return (
        <>{funnelData && funnelDataPrev &&
        <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            {/* Переходы на сайт */}
            <div className = 'funnelRowContainer'>
                <div style = {{visibility: 'hidden'}}>
                    <div>{CountPercents(funnelData[0], funnelDataPrev[0])}</div>
                </div>
                <div style = {{backgroundImage: `url(${staticpath}components/Funnel1.png)`}} className = 'funnelRow'>
                    <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                        <div className = 'funnelRowValue'>{funnelData[0]}</div>
                        <div className = 'funnelRowTitle'>перешли на сайт</div>
                    </div>
                    <img style = {{visibility: 'hidden', width: '100%', height: '0px'}} src = {`${staticpath}components/Funnel1.png`}></img>
                </div>
                <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div>{funnelData[0]}</div>
                    <div>{CountPercents(funnelData[0], funnelDataPrev[0])}</div>
                </div>
            </div>
            
            <div className = 'funnelRowPercent'>{RounderN((funnelData[1]/funnelData[0])*100, 1)} %</div>


            {/* Добавление в корзину */}
            <div className = 'funnelRowContainer'>
                <div style = {{visibility: 'hidden'}}>
                    <div>{CountPercents(funnelData[1], funnelDataPrev[1])}</div>
                </div>
                <div style = {{backgroundImage: `url(${staticpath}components/Funnel2.png)`}} className = 'funnelRow'>
                    <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                        <div className = 'funnelRowValue'>{funnelData[1]} ({funnelData[2]})</div>
                        <div className = 'funnelRowTitle'>добавили в корзину</div>
                    </div>
                    <img style = {{visibility: 'hidden', width: '100%', height: '0px'}} src = {`${staticpath}components/Funnel1.png`}></img>
                </div>
                <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div>{funnelData[1]}</div>
                    <div>{CountPercents(funnelData[1], funnelDataPrev[1])}</div>
                </div>

            </div>
            
            <div className = 'funnelRowPercent'>{RounderN((funnelData[3]/funnelData[1])*100, 1)} %</div>
            
            {/*  Заказы  */}
            <div className = 'funnelRowContainer'>
                <div style = {{visibility: 'hidden'}}>
                    <div>{CountPercents(funnelData[3], funnelDataPrev[3])}</div>
                </div>
                <div style = {{backgroundImage: `url(${staticpath}components/Funnel3.png)`}} className = 'funnelRow'>
                    <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%'}}>
                        <div className = 'funnelRowValue'>{funnelData[3]}</div>
                        <div className = 'funnelRowTitle'>заказ</div>
                    </div>
                    <img style = {{visibility: 'hidden', width: '100%', height: '0px'}} src = {`${staticpath}components/Funnel1.png`}></img>
                </div>
                <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div>{funnelData[3]}</div>
                    <div>{CountPercents(funnelData[3], funnelDataPrev[3])}</div>
                </div>
            </div>

            {/* Доход */}
            <div className = 'funnelRevenue'>{funnelData[4]} руб</div>

        </div>}
        </>
    )
}

export default FunnelRowsComponent
