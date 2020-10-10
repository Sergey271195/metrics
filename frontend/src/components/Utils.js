import React, {useState, useEffect} from 'react'

export const GAURL = 'https://api-metrika.yandex.net/analytics/v3/data/ga'

export const GETFetch = (url) => {

    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        if (!url) return;
        fetch(url)
            .then(response => response.json())
                .then(data => setData(data))
                    .then(() => setLoading(false))
                        .catch(error => {
                            setError(error)
                })
       
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

export const GETFetchAuthV = (url, token) => {

        if (!url) return;
        if (!token) return;
        return fetch(url, {
            method: 'GET',
            headers: {"Authorization": `OAuth ${token}`}
        }).catch(error => console.log(error))

}

export const PostFetch = (url, data) => {
    
    return(
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(data)
            }).then(response => response.json())
    )
}

export const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
}

export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data): data 
}

export const RounderN = (num, n) => {
    return Math.round(num*Math.pow(10, n))/Math.pow(10, n)
}