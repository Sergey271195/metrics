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