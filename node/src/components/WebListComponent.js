import React, {useEffect, useContext} from 'react'
import { TokenContext } from '../context/TokenContext'
import { WebListContext } from '../context/WebListContext'
import { GETFetchAuth } from './Utils'
import WebListItem  from './WebListItem'

const WebListComponent = () => {

    const { webpages, setWebpages } = useContext(WebListContext)
    const { token } = useContext(TokenContext)
    const {loading, data, error} = GETFetchAuth('https://api-metrika.yandex.net/management/v1/counters', token)
    
    useEffect(() => {
        if (!data) return;
        setWebpages(data.counters)
    }, [data])

    if (error) return <div>Oops. Something went wrong...</div>
    if (loading) return <div>Loading</div>
    return(
        <div>
            {webpages.map(item => {
                return( <WebListItem key = {item.id} name = {item.name} id = {item.id}/> )
            })}
        </div>
    )

}

export default WebListComponent