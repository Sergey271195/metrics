import React, { createContext, useReducer } from 'react'
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

    const [ views, dispatchViews ] = useReducer(ViewsReducer, ResetViewsOption)

    return(
        <ViewsContext.Provider value = {{views, dispatchViews}}>
            {props.children}
        </ViewsContext.Provider>
    )

}

export default ViewsContextProvider