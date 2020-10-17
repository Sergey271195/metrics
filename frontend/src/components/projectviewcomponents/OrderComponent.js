import React, {useState, useContext, useEffect} from 'react'
import { GETFetchAuthV } from '../Utils'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import CompareComponent from './CompareComponent'
import OrderPlotComponent from './OrderPlotComponent'
import CurrentYearOrderPlotComponent from './CurrentYearOrderPlotComponent'
import PredictionPlot from './PredictionPlot'
import { DataForPlotsContext } from '../../context/DataForPlotsContext'


const OrderComponent = ({updatePlot, setUpdatePlot}) => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const { timePeriod: {
                firstPeriod,
                secondPeriod
            },
                setTimePeriod } = useContext(DataForPlotsContext)

    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    const [ dataFirstPart, setDataFirstPart ] = useState()
    const [ dataSecondPart, setDataSecondPart ] = useState()
    

    const fetchNewData = (event) => {
        event.preventDefault()
        if (new Date(firstPeriod.start) - new Date(firstPeriod.end) > 0) return
        if (new Date(secondPeriod.start) - new Date(secondPeriod.end) > 0) return
        setUpdatePlot(!updatePlot)
    }

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
        <div>
            <form onSubmit = {(event) => fetchNewData(event)}>
                <div style = {{display: 'flex'}}>
                    <input defaultValue = {firstPeriod.start} type = 'date' placeholder = 'Начало первого периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_FIRST_START', data: event.target.value})}/>
                    <input defaultValue = {firstPeriod.end} type = 'date' placeholder = 'Окончание первого периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_FIRST_END', data: event.target.value})}/>
                </div>
                
                <div style = {{display: 'flex'}}>
                    <input value = {secondPeriod.start} type = 'date' placeholder = 'Начало второго периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_SECOND_START', data: event.target.value})}/>
                    <input value = {secondPeriod.end} type = 'date' placeholder = 'Окончание второго периода'
                        onChange = {(event) => setTimePeriod({type: 'CHANGE_SECOND_END', data: event.target.value})}/>
                </div>
                <button>Сравнить периоды</button>
            </form>
            
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
