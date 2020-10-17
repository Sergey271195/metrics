(<div style = {{display: 'flex', flexDirection: 'column'}}>

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


    /* useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.jandexid}reaches
&date1=${firstPeriod.start}
&date2=${firstPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            setCurrentGoalsData(data.map(entry =>{
                console.log('entry')
                console.log(entry.totals[0])
                return (entry.totals[0])}))
        })
    }, [goals, updatePlot]) */

    /* useEffect(() => {
        if (!goals) return
        Promise.all(goals.map(goal => {
            return GETFetchAuthV(`${JandexStat}id=${project.webpage.jandexid}
&metrics=ym:s:goal${goal.jandexid}reaches
&date1=${secondPeriod.start}
&date2=${secondPeriod.end}`, token)
        })).then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => setPreviousGoalsData(data.map(entry =>{return (entry.totals[0])})))
    }, [goals, updatePlot]) */