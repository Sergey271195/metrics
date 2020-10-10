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

    const { data: goals } = GETFetchAuth(`https://api-metrika.yandex.net/management/v1/counter/${project.webpage.jandexid}/goals`, token)


    const createQuery = (goals) => {
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

    /* Электронная коммерция */

    useEffect(() => {
        GETFetchAuthV(`https://api-metrika.yandex.net/stat/v1/data?id=${project.webpage.jandexid}&metrics=ym:s:ecommercePurchases&metrics=ym:s:ecommerceRevenuePerPurchase&metrics=ym:s:ecommerceRevenuePerVisit&metrics=ym:s:ecommerceRevenue&date1=2018-09-01&date2=2020-07-31`, token)
            .then(response => response.json())
                .then(data => setCommercialInfo(data.totals))
                    .catch(error => console.log(error))
    }, [])

    useEffect(() => {
        const ctx = document.getElementById("MyChart")
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                responsive: true,
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }, [])

    return(

        <div style = {{display: 'flex', flexDirection: 'column'}}>

            {/* Область заказов */}
            <div>Заказы</div>
            <OrderComponent />

            {/* Local Info */}
            <div style = {{display: 'flex', flexDirection: 'column'}}>

                <ToMainButton />
                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div>Инофрмация из базы</div>
                    <div onClick = {() => switchToProjectView()} style = {{
                        display: 'flex', flexDirection: 'column', border: '1px solid black', padding: '10px'
                    }}>
                        <div>Название проекта: {project.name}</div>
                        <div>Тип проекта: {project._type}</div>
                        <div>Связанный вебсайт: {project.webpage.name}</div>

                        <div>Связанные сотрудники</div>
                        <div style = {{marginLeft: '10px'}}>
                            {/* Implement switch to employee view */}

                            {project.employees.map(employee => {
                                return <div key = {employee.id}>{employee.name} - {employee.role}</div>
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Jandex Info */}
            <div style = {{display: 'flex', flexDirection: 'column'}}>

                <div style = {{display: 'flex', flexDirection: 'column'}}>
                    <div>Инофрмация из Яндекса</div>
                    <div style = {{margin: '10px', fontSize: '20px'}}>Цели</div>
                    {goalsData.map((goal, index) => {
                        return(
                            <div key = {index}>
                            <div>Название цели: {goals.goals[index].name}</div>
                            <div>Complitions: {goal[0]}</div>
                            <div>Conversion rate: {goal[1]}</div>
                            </div>
                        )
                    })}

                    <div style = {{margin: '10px', fontSize: '20px'}}>Пользователи</div>
                    {usersData &&
                    <div>
                        <div>Число пользователей: {usersData[0][0]}</div>
                        <div>Число новых пользователей: {usersData[1][0]}</div>
                    </div>
                    }

                    {/* Просмотры */}

                    <div style = {{margin: '10px', fontSize: '20px'}}>Инофрмация о просмотрах</div>
                    {viewsData &&
                        Object.keys(viewsData).map(
                            key => {
                                return <div key = {key}>{key}: {viewsData[key]}</div>
                            }
                        )
                    }

                    {/* Электронная коммерция */ }

                    {commercialInfo && <>
                    <div style = {{margin: '10px', fontSize: '20px'}}>Коммерческая информация</div>
                    {commercialInfo.map((entry, index) => {
                        return <div key = {COMMERCIAL_METRICS_NAMES[index]}>{COMMERCIAL_METRICS_NAMES[index]}: {entry}</div>
                    })}
                    </>}
                    

                </div>
            
            </div>

            {/* Chart render */}
            <div className = 'chartWrapper' width = "40%" height = "40%">
                <canvas id = "MyChart" ></canvas>
            </div>

        </div>
    )
}

export default ProjectView