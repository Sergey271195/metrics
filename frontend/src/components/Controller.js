import React, {useEffect, useContext} from 'react'
import { CurrentWebPageContext } from '../context/CurrentWebPageContext'
import { TokenContext } from '../context/TokenContext'
import CurrentPageComponent from './CurrentPageComponent'
import { GETFetch } from './Utils'
import WebListComponent from './WebListComponent'

const Controller = () => {

    const { setToken } = useContext(TokenContext)
    const {loading, data, error} = GETFetch('api/token')
    const { currentPage } = useContext(CurrentWebPageContext)
    
    useEffect(() => {
        if (data) {
            setToken(data.token)
        }
    }, [data])

    if (error) return <div>Ooops. Something went wrong...</div>
    if (loading) return <div>Loading</div>
    return(
        <div style = {{display: 'flex'}}>
            <WebListComponent />
            {currentPage && <CurrentPageComponent />}
        </div>
    )

}

export default Controller