import React, { createContext, useState } from 'react'

export const StaticContext = createContext()

const StaticContextProvider = (props) => {

    const [staticpath, setStaticpath ] = useState()

    return (
        <StaticContext.Provider value = {{staticpath, setStaticpath}}>
            {props.children}
        </StaticContext.Provider>
    )
}

export default StaticContextProvider
