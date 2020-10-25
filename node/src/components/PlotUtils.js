export const clearPlot = (canvasId, wrapperId) => {
    let ctx = document.getElementById(canvasId)
    let wrapper = document.getElementsByClassName(wrapperId)[0]
    if (!ctx) return
    ctx.remove()
    let newcanvas = document.createElement("canvas")
    newcanvas.id = canvasId
    wrapper.appendChild(newcanvas)
    ctx = document.getElementById(canvasId)
    return ctx
}

export const formatDatePeriods = (data) => {
    return data.map(item => {
        return item[0].substring(8, 10) + item[0].substring(4, 7)
    })
}  

export const aggregateData = (data) => {
    let aggregator = 0
    const aggData =  data.map(item => {
        aggregator+=item
        return aggregator
    })
    return aggregator == 0 ? [] : aggData
}

export const dataAggregator = (data) => {
    if (!data) return [0]
    return data.reduce((acc, item) => {
        if (acc.length === 0) {
            return [item]
        }
        else {
            return [...acc, acc[acc.length-1] + item]
        }  
    }, [])
}

export const TrafficSources = [
    {
        id: 'organic',
        name: 'Search engine traffic',
        label: 'Поисковый трафик',
        show: true
    },
    {
        id: 'ad',
        name: 'Add traffic',
        label: 'Рекламный трафик',
        show: true
    },
    {
        id: 'direct',
        name: 'Direct traffic',
        label: 'Прямой трафик',
        show: true
    },
    {
        id: 'referral',
        name: 'Link traffic',
        label: 'По ссылке',
        show: true
    },
    {
        id: 'social',
        name: 'Soical network traffic',
        label: 'Социальные сети',
        show: true
    },
    {
        id: 'internal',
        name: 'Internal traffic',
        label: 'Внутренний трафик',
        show: true
    },
    {
        id: 'recommend',
        name: 'Recommendation system traffic',
        label: 'Рек. система трафика',
        show: true
    },
    {
        id: 'email',
        name: 'Mailing traffic',
        label: 'Почтовый трафик',
        show: true
    }
]

export const TrafficSourcesDict = 
    {
        'organic': {
            name: 'Search engine traffic',
            label: 'Поисковый трафик',
            show: true
        },
        'ad': {
            name: 'Add traffic',
            label: 'Рекламный трафик',
            show: true
        },
        'direct': {
            name: 'Direct traffic',
            label: 'Прямой трафик',
            show: true
        },
        'referral': {
            name: 'Link traffic',
            label: 'По ссылке',
            show: true
        },
        'social': {
            name: 'Soical network traffic',
            label: 'Социальные сети',
            show: true
        },
        'internal': {
            name: 'Internal traffic',
            label: 'Внутренний трафик',
            show: true
        },
        'recommend': {
            name: 'Recommendation system traffic',
            label: 'Рекомендат. система',
            show: true
        },
        'email': {
            name: 'Mailing traffic',
            label: 'Почтовый трафик',
            show: true
        }
    }

export const trafficReducer = (traffic) => {
    return traffic.filter(source => source.show).reduce((arr, source) => {
        return [...arr, source.id]
    }, [])
}

export const groupTrafficReducer = (arr, sources) => {
    return arr.map(leads => leads.data.filter(source => 
        sources.includes(source.dimensions[0].id))
    ).map(source => {
        return source.reduce((acc, src) => {
            if (acc.length == 0) {
                return src.metrics
            }
            else {
                return (
                    src.metrics.map((metric, index) => {
                        return acc[index] + metric
                    })
                )
            }
            
        }, [])
    }).reduce((acc, subarray) => {
        return [...acc, ...subarray]
    }, [])
}

export const timeTrafficReducer = (arr, sources) => {
    return arr.filter(src => sources.includes(src.dimensions[0].id))
        .reduce((acc, item) => {
            if (acc.length === 0) {
                return item.metrics[0]
            }
            else {
                return item.metrics[0].map((source, index) => {
                    return acc[index] + source
                })
            }
        }, [])
}


export const allDataRedcuer = (data, sources) => {
    return data.map(batch => batch.data.filter(entry => 
        sources.includes(entry.dimensions[0].id)).reduce((acc, item) => {
            if (acc.length === 0) {
                return item.metrics
            }
            return item.metrics.map((goal, index) => {
                return goal.map((data, inner_index) => {
                    return acc[index][inner_index] + data
                    })
                })
            }, [])
        ).reduce((acc, item) => {
            return [...acc, ...item]
        }, [])
}

export const allDataAggregator = (data) => {
    return data.reduce((acc, item) => {
        if (acc.length === 0) {
            return item
        }
        return item.map((data, index) => {
            return acc[index] + data
        })
    }, [])
}

export const plotTypeDict = {
    'Purchases': {
        id: 0,
        label: 'Количество',
        request: 'ym:s:ecommercePurchases'
    },
    'TotalSum': {
        id: 1,
        label: 'Общая сумма',
        request: 'ym:s:ecommerceRevenue'
    },
    'SumPerPurchase': {
        id: 2,
        label: 'Средний чек',
        request: 'ym:s:ecommerceRevenuePerPurchase'
    }
}

export const allDataRedcuerLight = (data, sources) => {
    return data.data.filter(entry => 
        sources.includes(entry.dimensions[0].id)).reduce((acc, item) => {
            if (acc.length === 0) {
                return item.metrics
            }
            return item.metrics.map((goal, index) => {
                return goal.map((data, inner_index) => {
                    return acc[index][inner_index] + data
                    })
                })
            }, [])
}