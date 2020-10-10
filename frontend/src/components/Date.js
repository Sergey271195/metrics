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
    console.log(date)
    return date
}

export const startPreviousMonth = (date) => {
    date.setMonth(date.getMonth()-1, 1)
    console.log(date)
    return date 
}