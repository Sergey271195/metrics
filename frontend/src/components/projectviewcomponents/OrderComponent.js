import React, {useState, useContext, useEffect} from 'react'
import { GETFetchAuthV } from '../Utils'
import { currentDate, startOfCurrentMonth, previousMonthSameDate, startPreviousMonth, formatDate } from '../Date'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import CompareComponent from './CompareComponent'

const OrderComponent = () => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const JandexStat = 'https://api-metrika.yandex.net/stat/v1/data?'
    const project = views.project.data

    const [ dataFirstPart, setDataFirstPart ] = useState()
    const [ dataSecondPart, setDataSecondPart ] = useState()
    const [ firstPeriod, setFirstPeriod ] = useState({
        start: startOfCurrentMonth(),
        end: currentDate()
    })
    const [ secondPeriod, setSecondPeriod ] = useState({
        start: startPreviousMonth(startOfCurrentMonth()),
        end: previousMonthSameDate(currentDate())
    })


    /* Fetching orders data for two time periods */
    /* Currently - current and previous months */
    /* TODO - arbitrary time periods */

    useEffect(() => {

        /* Info for the first part of time period */

        GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:visits
&metrics=ym:s:productBasketsUniq
&metrics=ym:s:ecommercePurchases
&metrics=ym:s:ecommerceRevenue
&metrics=ym:s:ecommerceRevenuePerPurchase
&date1=${formatDate(firstPeriod.start)}
&date2=${formatDate(firstPeriod.end)}`, token)
            .then(response => response.json())
                .then(data => {console.log(data), setDataFirstPart(data.totals)})
                    .catch(error => console.log(error))

    }, [firstPeriod])
    
    useEffect(() => {

        /* Info for the second part of time period (month before)*/

        GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:visits
&metrics=ym:s:productBasketsUniq
&metrics=ym:s:ecommercePurchases
&metrics=ym:s:ecommerceRevenue
&metrics=ym:s:ecommerceRevenuePerPurchase
&date1=${formatDate(secondPeriod.start)}
&date2=${formatDate(secondPeriod.end)}`, token)
            .then(response => response.json())
                .then(data => {console.log(data), setDataSecondPart(data.totals)})
                    .catch(error => console.log(error))

    }, [secondPeriod])



    return(
        <div>
            <div style = {{display: 'flex'}}>
                <input type = 'date' placeholder = 'Начало первого периода' onChange = {(event) => {console.log(event.target.value)}}/>
                <input type = 'date' placeholder = 'Окончание первого периода'/>
            </div>
            
            <div style = {{display: 'flex'}}>
                <input type = 'date' placeholder = 'Начало второго периода'/>
                <input type = 'date' placeholder = 'Окончание второго периода'/>
            </div>

            <CompareComponent dataFirstPart = {dataFirstPart} dataSecondPart = {dataSecondPart} />
        </div>
    )


}


export default OrderComponent
