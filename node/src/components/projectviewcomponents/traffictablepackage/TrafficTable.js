import React from 'react'
import SourceTemplateComponent from './SourceTemplateComponent'
import BoxComponent from '../../utilcomponents/BoxComponent'
import OtherSourcesComponent from './OtherSourcesComponent'

import '../../../styles/TrafficTable.css'

const TrafficTable = ({updatePlot}) => {  

    return (
        <>
            <div className = 'trafficTableTitle'>Показатели по источникам трафика</div>
            <BoxComponent size = {{flexDirection: 'column', paddingTop: '20px', paddingLeft: '40px', paddingRight: '40px'}}>
                {/* HEADER */}
                <div className = 'tableHead'>
                    <div style = {{flex: '2'}}>Источники</div>
                    <div style = {{flex: '1'}}>Визиты</div>
                    <div style = {{flex: '1'}}>Кол-во заказов</div>
                    <div style = {{flex: '1'}}>Сумма заказов</div>
                    <div style = {{flex: '1'}}>Средний чек</div>
                    <div style = {{flex: '1'}}>Лиды</div>
                </div>

                <SourceTemplateComponent updatePlot = {updatePlot} 
                    url = {'search_engine'} title = {'Переходы из поисковых систем'}/>
                <SourceTemplateComponent updatePlot = {updatePlot} 
                    url = {'social_network'} title = {'Переходы из социальных сетей'}/>
                <SourceTemplateComponent updatePlot = {updatePlot} 
                    url = {'adv_engine'} title = {'Переходы по рекламе'}/>
                <SourceTemplateComponent updatePlot = {updatePlot} 
                    url = {'referal_source'} title = {'Переходы по ссылкам на сайтах'}/>
                
                <OtherSourcesComponent updatePlot = {updatePlot} />
                    
            </BoxComponent>
        </>
    )
}

export default TrafficTable
