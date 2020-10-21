import React, {createContext, useState} from 'react'

export const CurrentWebPageContext = createContext();

const CurrentWebPageContextProvider = (props) => {

    const [currentPage, setCurrentPage] = useState();

    return(
        <CurrentWebPageContext.Provider value = {{currentPage, setCurrentPage}}>
            {props.children}
        </CurrentWebPageContext.Provider>
    )

}

export default CurrentWebPageContextProvider