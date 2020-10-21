export const EmployeeReducer = (state, action) => {
    switch(action.type) {
        case 'FETCH': {
            return action.data
        }
        case 'CREATE': {
            return [...state, action.data]
        }
        case 'DELETE': {
            return state.filter(employee => employee.id != action.id)
        }

        default:
            return state
    }
}