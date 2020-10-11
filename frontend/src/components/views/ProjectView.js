import React, { useContext, useEffect, useState } from 'react'
import { TokenContext } from '../../context/TokenContext'
import { ViewsContext } from '../../context/ViewsContext'
import ToMainButton from '../routerbuttons/ToMainButton'
import { GETFetchAuthV, GETFetchAuth, GAURL } from '../Utils'
import OrderComponent from '../projectviewcomponents/OrderComponent'
import Chart from 'chart.js';

const ProjectView = () => {

    const { views } = useContext(ViewsContext)
    const { token } = useContext(TokenContext)

    const COMMERCIAL_METRICS_NAMES = ['Purchases','RevenuePerPurchase', 'RevenuePerVisit', 'Revenue']

    const [goalsData, setGoalsData] = useState([])
    const [viewsData, setViewsData] = useState()
    const [usersData, setUsersData] = useState()
    const [commercialInfo, setCommercialInfo] = useState()

    const project = views.project.data


    /* const createQuery = (goals) => {
        return goals.goals.map(goal => {
            return `&metrics=ga%3Agoal${goal.id}Completions&metrics=ga%3Agoal${goal.id}ConversionRate`
        }).join('&')
    }
    
    useEffect(() => {
        if (!goals) return
        Promise.all(goals.goals.map(goal => {
            const query = `metrics=ga%3Agoal${goal.id}Completions&metrics=ga%3Agoal${goal.id}ConversionRate`
            return GETFetchAuthV(`${GAURL}?end-date=2020-10-01&ids=ga%3A${project.webpage.jandexid}&${query}&start-date=2018-09-01`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
            .then(data => setGoalsData(data.map(entry => {return entry.rows[0]})))
                .catch(error => console.log(error))
    }, [goals])

    useEffect(() => {
        Promise.all(
            [GETFetchAuthV(`${GAURL}?end-date=2020-10-01&ids=ga%3A${project.webpage.jandexid}&metrics=ga%3Ausers&start-date=2018-09-01`, token),
            GETFetchAuthV(`${GAURL}?end-date=2020-10-01&ids=ga%3A${project.webpage.jandexid}&metrics=ga%3AnewUsers&start-date=2018-09-01`, token)]
        ).then(responses => Promise.all(responses.map(response => response.json())))
            .then(data => setUsersData(data.map(entry => {return entry.rows[0]})))
                .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        const query = `metrics=ga:pageviews&metrics=ga:pageviewsPerSession&metrics=ga:timeOnPage&metrics=ga:avgTimeOnPage`
        GETFetchAuthV(`${GAURL}?end-date=2020-10-01&ids=ga%3A${project.webpage.jandexid}&${query}&start-date=2018-09-01`, token)
            .then(response => response.json())
                .then(data => setViewsData(data.totalsForAllResults))
                    .catch(error => console.log(error))
    }, [])
 */
    /* Электронная коммерция */

    /* useEffect(() => {
        GETFetchAuthV(`https://api-metrika.yandex.net/stat/v1/data?id=${project.webpage.jandexid}&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenuePerPurchase&metrics=ym:s:ecommerceRevenuePerVisit&metrics=ym:s:ecommerceRevenue&date1=2018-09-01&date2=2020-07-31`, token)
            .then(response => response.json())
                .then(data => setCommercialInfo(data.totals))
                    .catch(error => console.log(error))
    }, [])
 */
    return(
        <div style = {{display: 'flex', flexDirection: 'column'}}>
            <div style = {{display: 'flex'}}>
                <ToMainButton />
                <div style  = {{marginLeft: '20px'}}>Заказы</div>
            </div>
            <OrderComponent />
        </div>
    )
}

export default ProjectView