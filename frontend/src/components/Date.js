export const currentDate = () => {
    return new Date()
}

export const startOfCurrentMonth = () => {
    const date = new Date()
    date.setDate(1)
    return date
}

export const formatDate = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month >= 10 ? month : '0'+month}-${day >= 10 ? day : '0'+day}`
}

export const previousMonthSameDate = (date) => {
    const currMonth = date.getMonth()
    date.setMonth(currMonth - 1)
    if (date.getMonth() === currMonth) {
        date.setDate(0)
    }
    return date
}

export const startPreviousMonth = (date) => {
    date.setMonth(date.getMonth()-1, 1)
    return date 
}

export const getCurrentYearPeriodsByMonth = () => {
    const date = new Date()
    const lastMonth = date.getMonth()
    const startDates = []
    const endDates = []
    if (lastMonth > 0) {
        for (let i = 0; i < lastMonth; i++) {
            date.setMonth(i, 1)
            startDates.push(formatDate(date))
            date.setMonth(i+1, 0)
            endDates.push(formatDate(date))
        }
    }
    date.setMonth(lastMonth, 1)
    startDates.push(formatDate(date))
    endDates.push(formatDate(new Date()))
    
    return [startDates, endDates]
}

export const getCurrentYearStart = () => {
    const date = new Date()
    date.setMonth(0, 1)
    return date
}

export const MONTH_DICTIONARY = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
        "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]