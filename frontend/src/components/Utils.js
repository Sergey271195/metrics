import React, {useState, useEffect} from 'react'


export const GETFetch = (url, token) => {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        if (!url) return;
        if (!token) {
            fetch(url)
                .then(response => response.json())
                    .then(data => setData(data))
                        .then(() => setLoading(false))
                            .catch(error => {
                                setError(error)
                    })
        }
        else {
            fetch(url, {
                method: 'GET',
                headers: {"Authorization": `OAuth ${token}`}
            })
                .then(response => response.json())
                    .then(data => setData(data))
                        .then(() => setLoading(false))
                            .catch(error => {
                                setError(error)
                    })
        }
        
    }, [url])
    

    return {loading, data, error}

}


export const GETFetchAuth = (url, token) => {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        if (!url) return;
        if (!token) return;
        fetch(url, {
            method: 'GET',
            headers: {"Authorization": `OAuth ${token}`}
        })
            .then(response => response.json())
                .then(data => setData(data))
                    .then(() => setLoading(false))
                        .catch(error => {
                            setError(error)
                })
        
    }, [url])
    

    return {loading, data, error}

}