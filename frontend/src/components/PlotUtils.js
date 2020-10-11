export const clearPlot = (canvasId, wrapperId) => {
    let ctx = document.getElementById(canvasId)
    let wrapper = document.getElementsByClassName(wrapperId)[0]
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