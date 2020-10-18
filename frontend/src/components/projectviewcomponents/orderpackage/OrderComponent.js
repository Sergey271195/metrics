import React, { useState, useContext, useEffect } from 'react'
import { GETFetchAuthV } from '../../Utils'
import { TokenContext } from '../../../context/TokenContext'
import { ViewsContext } from '../../../context/ViewsContext'
import CompareComponent from './CompareComponent'
import OrderPlotComponent from './OrderPlotComponent'
import CurrentYearOrderPlotComponent from './CurrentYearOrderPlotComponent'
import PredictionPlot from './PredictionPlot'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'


const OrderComponent = ({updatePlot, setUpdatePlot}) => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)
    

    const { timePeriod: {
                firstPeriod,
                secondPeriod,
                filterParam
            },
                setTimePeriod } = useContext(DataForPlotsContext)

    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    const [ dataFirstPart, setDataFirstPart ] = useState()
    const [ dataSecondPart, setDataSecondPart ] = useState()

    useEffect(() => {

        /* Info for the first part of time period */

        GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:visits
&metrics=ym:s:productBasketsUniq
&metrics=ym:s:productBasketsQuantity
&metrics=ym:s:ecommercePurchases
&metrics=ym:s:ecommerceRevenue
&metrics=ym:s:ecommerceRevenuePerPurchase
&date1=${firstPeriod.start}
&date2=${firstPeriod.end}`, token)
            .then(response => response.json())
                .then(data => setDataFirstPart(data.totals))
                    .catch(error => console.log(error))

    }, [updatePlot])
    
    useEffect(() => {

        /* Info for the second part of time period (month before)*/

        GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:visits
&metrics=ym:s:productBasketsUniq
&metrics=ym:s:productBasketsQuantity
&metrics=ym:s:ecommercePurchases
&metrics=ym:s:ecommerceRevenue
&metrics=ym:s:ecommerceRevenuePerPurchase
&date1=${secondPeriod.start}
&date2=${secondPeriod.end}`, token)
            .then(response => response.json())
                .then(data => setDataSecondPart(data.totals))
                    .catch(error => console.log(error))

    }, [updatePlot])

    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div style = {{display: 'flex'}}>
                <h1>Заказы</h1>
                <OrderPlotComponent dataFirstPart = {dataFirstPart} />
                <CompareComponent dataFirstPart = {dataFirstPart} dataSecondPart = {dataSecondPart} />
            </div>
            <div style = {{display: 'flex', flexDirection: 'column'}}>
                <h1>Заказы по месяцам</h1>
                <CurrentYearOrderPlotComponent />
                <h1>Прогноз по заказам (//TODO)</h1>
                <PredictionPlot updatePlot = {updatePlot}/>
            </div>
        </div>
    )


}


export default OrderComponent
