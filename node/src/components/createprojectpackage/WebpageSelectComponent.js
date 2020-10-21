import React, { useState, useEffect } from 'react'

const WebpageSelectComponent = ({connectedWebpage, setConnectedWebpage}) => {

    const [availableWebpages, setAvailableWebpages] = useState([])

    const GetWP = () => {
        fetch('/api/getwp/')
            .then(response => response.json())
                .then(data => setAvailableWebpages(data))
                    .catch(error => console.log(error))
    }

    useEffect(() => {
        GetWP()
    }, [])

        return(
            <div>
                <select value = { connectedWebpage } onChange = {(event) => setConnectedWebpage(event.target.value)}>
                    <option></option>
                    {availableWebpages && availableWebpages.map(page => {
                        return(
                            <option key = {page.jandexid} value = {page.jandexid}>{page.name}</option>
                        )
                    })}
                </select>
            </div>
        )
}

export default WebpageSelectComponent