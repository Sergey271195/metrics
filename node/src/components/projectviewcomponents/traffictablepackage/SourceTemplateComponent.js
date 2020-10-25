import React, {useState, useEffect, useContext} from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { PostFetch, RounderN } from '../../Utils'

const SourceTemplateComponent = ({updatePlot, CountPercents, url, title}) => {

    const { views } = useContext(ViewsContext)
    const { timePeriod: {
        firstPeriod, secondPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ sourceData, setSourceData ] = useState()
    const [ show, setShow ] = useState(false)

    useEffect(() => {
        const data = {
            date1_a: firstPeriod.start,
            date2_a: firstPeriod.end,
            date1_b: secondPeriod.start,
            date2_b: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch(`/api/jandexdata/${url}`, data)
            .then(data => {
                setSourceData(data)
            })
    }, [updatePlot])

    return (
        <>
            <div style = {{display: 'flex', justifyContent: 'space-evenly', borderTop: '1px solid black'}}>
                
                <div style = {{width: '25%'}}>
                    <button onClick = {() => setShow(!show)}>+</button>
                    {title}
                </div>
                {sourceData && sourceData.totals['a'].map((total, index) => {
                    return (
                        <div style = {{display: 'flex', marginLeft: '20px',
                            alignItems: 'center', width: '20%'}}  key = {index}>
                            <div>{RounderN(total, 1)}</div>
                            <div style = {{marginLeft: '8px'}}>{CountPercents(total, sourceData.totals['b'][index])}</div>
                        </div>
                    )
                })}
            </div>
                {sourceData && show && sourceData.data.map(entry => {
                    return(
                        <div key = {entry.dimensions[0].name} style = {{display: 'flex', justifyContent: 'space-evenly'}}>
                            <div style = {{width: '25%'}}>{entry.dimensions[0].name}</div>
                            {entry.metrics['a'].map((value, index) => {
                                return (
                                    <div style = {{display: 'flex', marginLeft: '20px',
                                        alignItems: 'center', width: '20%'}} key = {entry.dimensions[0].name +index}>
                                        <div>{value ? RounderN(value, 1): 0}</div>
                                        <div style = {{marginLeft: '8px'}}>{CountPercents(value, entry.metrics['b'][index])}</div>
                                    </div>
                                    )
                            })}
                        </div>
                    ) 
                })}
        </>
    )
}

export default SourceTemplateComponent
