import React, {useState, useContext, useEffect} from 'react'
import { GETFetchAuthV } from '../Utils'
import { currentDate, startOfCurrentMonth, previousMonthSameDate, startPreviousMonth, formatDate } from '../Date'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import CompareComponent from './CompareComponent'
import OrderPlotComponent from './OrderPlotComponent'
import CurrentYearOrderPlotComponent from './CurrentYearOrderPlotComponent'

const OrderComponent = () => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    const [ dataFirstPart, setDataFirstPart ] = useState()
    const [ dataSecondPart, setDataSecondPart ] = useState()
    const [ updatePlot, setUpdatePlot ] = useState(true)

    const [ firstPeriod, setFirstPeriod ] = useState({
        start: formatDate(startOfCurrentMonth()),
        end: formatDate(currentDate())
    })
    const [ secondPeriod, setSecondPeriod ] = useState({
        start: formatDate(startPreviousMonth(startOfCurrentMonth())),
        end: formatDate(previousMonthSameDate(currentDate()))
    })


    const fetchNewData = (event) => {
        event.preventDefault()
        if (new Date(firstPeriod.start) - new Date(firstPeriod.end) > 0) return
        if (new Date(secondPeriod.start) - new Date(secondPeriod.end) > 0) return
        console.log('Success')
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
                .then(data => {console.log(data), setDataFirstPart(data.totals)})
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
                .then(data => {console.log(data), setDataSecondPart(data.totals)})
                    .catch(error => console.log(error))

    }, [updatePlot])

    return(
        <div>
            <form onSubmit = {(event) => fetchNewData(event)}>
                <div style = {{display: 'flex'}}>
                    <input defaultValue = {firstPeriod.start} type = 'date' placeholder = 'Начало первого периода'
                        onChange = {(event) => {setFirstPeriod({...firstPeriod, start: event.target.value})}}/>
                    <input defaultValue = {firstPeriod.end} type = 'date' placeholder = 'Окончание первого периода'
                        onChange = {(event) => {setFirstPeriod({...firstPeriod, end: event.target.value})}}/>
                </div>
                
                <div style = {{display: 'flex'}}>
                    <input value = {secondPeriod.start} type = 'date' placeholder = 'Начало второго периода'
                        onChange = {(event) => {setSecondPeriod({...secondPeriod, start: event.target.value})}}/>
                    <input value = {secondPeriod.end} type = 'date' placeholder = 'Окончание второго периода'
                        onChange = {(event) => {setSecondPeriod({...secondPeriod, end: event.target.value})}}/>
                </div>
                <button>Сравнить периоды</button>
            </form>
            
            <div style = {{display: 'flex'}}>
                <OrderPlotComponent dataFirstPart = {dataFirstPart} />
                <CompareComponent dataFirstPart = {dataFirstPart} dataSecondPart = {dataSecondPart} />
            </div>
            <div>
                <CurrentYearOrderPlotComponent />
            </div>
        </div>
    )


}


export default OrderComponent
