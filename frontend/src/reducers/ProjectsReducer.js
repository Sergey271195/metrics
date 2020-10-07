export const ProjectsReducer = (state, action) => {
    switch(action.type) {
        case 'FETCH': {
            return action.data
        }
        case 'CREATE': {
            return [...state, action.data]
        }
        case 'DELETE': {
            return state.filter(project => project.id != action.id)
        }
        case'ADD_USER': {
            return  state.map(project => {
                return project.id != action.project_id ? project : {...project, employees: [...project.employees, action.employee]}
            })
        }
        default:
            return state
    }
}