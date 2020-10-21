export const DataForPlotsReducer = (state, action) => {
    console.log(state)
    switch(action.type) {
        case 'CHANGE_FIRST_START': {
            return (
                {...state, firstPeriod: {...state.firstPeriod, start: action.data}}
            )
        }

        case 'CHANGE_FIRST_END': {
            return (
                {...state, firstPeriod: {...state.firstPeriod, end: action.data}}
            )
        }

        case 'CHANGE_SECOND_START': {
            return (
                {...state, secondPeriod: {...state.secondPeriod, start: action.data}}
            )
        }

        case 'CHANGE_SECOND_END': {
            return (
                {...state, secondPeriod: {...state.secondPeriod, end: action.data}}
            )
        }
        case'CHANGE_TRAFFIC_SOURCE': {
            return (
                {...state, filterParam: {sourceTraffic: action.data}}
            )
        }

        default:
            return state
    }
}
