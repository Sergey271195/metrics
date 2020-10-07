export const ViewsReducer = (state, action) => {
    switch(action.type) {

        case 'MAIN_VIEW': {
            return {project: 
                        {...state.project, show: false},
                    employee: 
                        {...state.employee, show: false},
                    main:
                        {...state.main, show: true}
                }
        }

        case 'PROJECT_VIEW': {
            return {project: 
                        {data: action.data, show: true},
                    employee: 
                        {...state.employee, show: false},
                    main:
                        {...state.main, show: false}
                }
        }

        case 'EMPLOYEE_VIEW': {
            return {project: 
                        {...state.project, show: false},
                    employee: 
                        {data: action.data, show: true},
                    main:
                        {...state.main, show: false}
                }
        }

    }
}