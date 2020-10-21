import React, { createContext, useState } from 'react'

export const WebListContext = createContext();

const WebListContextProvider = (props) => {

    const [webpages, setWebpages] = useState()

    return (
        <WebListContext.Provider value = {{webpages, setWebpages}}>
            {props.children}
        </WebListContext.Provider>
    )

} 

export default WebListContextProvider