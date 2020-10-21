import React, { createContext, useReducer, useEffect } from 'react'
import { saveToLocalStorage, getFromLocalStorage } from '../components/Utils';
import { ViewsReducer } from '../reducers/ViewsReducer';

export const ViewsContext = createContext();

const ResetViewsOption = {
    main: {show: true},
    project: {
        show: false,
        data: {}
    },
    employee: {
        show: false,
        data: {}
    },
}

const ViewsContextProvider = (props) => {

    const initial_data = getFromLocalStorage('view') ? getFromLocalStorage('view'): ResetViewsOption
    const [ views, dispatchViews ] = useReducer(ViewsReducer, initial_data)

    useEffect(() => {
        saveToLocalStorage('view', views)
    }, [views])

    return(
        <ViewsContext.Provider value = {{views, dispatchViews}}>
            {props.children}
        </ViewsContext.Provider>
    )

}

export default ViewsContextProvider