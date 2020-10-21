import React, {useContext} from 'react'
import { CurrentWebPageContext } from '../context/CurrentWebPageContext'

const WebListItem = ({name, id}) => {

    const {setCurrentPage} = useContext(CurrentWebPageContext)

    return(
    <div onClick = {() => setCurrentPage({name, id})}>
        {name}
    </div>
    )

}

export default WebListItem