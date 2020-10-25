import React, {useState, useEffect, useContext} from 'react'
import { DataForPlotsContext } from '../../../context/DataForPlotsContext'
import { ViewsContext } from '../../../context/ViewsContext'
import { trafficTableReducer } from '../../PlotUtils'
import { PostFetch, RounderN } from '../../Utils'
import { CountPercents } from './CounterComponent'

import {FiPlusSquare, FiMinusSquare} from 'react-icons/fi'

const SourceTemplateComponent = ({updatePlot, url, title}) => {

    const { views } = useContext(ViewsContext)
    const { timePeriod: {
        firstPeriod, secondPeriod
    }} = useContext(DataForPlotsContext)

    const project = views.project.data

    const [ sourceData, setSourceData ] = useState()
    const [ sourceGoalsData, setSourceGoalsData ] = useState()
    const [ show, setShow ] = useState(false)

    useEffect(() => {
        const data = {
            date1_a: firstPeriod.start,
            date2_a: firstPeriod.end,
            date1_b: secondPeriod.start,
            date2_b: secondPeriod.end,
            jandexid: project.webpage.jandexid
        } 
        PostFetch(`/api/jandexdata/${url}/goals`, data)
            .then(data => {
                setSourceGoalsData(trafficTableReducer(data))
            })
    }, [updatePlot])

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
            <div className = 'tableRow'>
                
                {/* MAIN PART */}
                <div className = 'firstTableCellMain'>
                    {show ? <FiMinusSquare onClick = {() => setShow(!show)} />: <FiPlusSquare onClick = {() => setShow(!show)} />}
                    <div style = {{marginLeft: '10px'}}>{title}</div>
                </div>
                    {sourceData &&  sourceData.totals['a'].map((total, index) => {
                        return (
                            <div className = 'tableCell' key = {index}>
                                <div style = {{flex: '0.5'}}>{RounderN(total, 1)}</div>
                                <div style = {{flex: '1'}}>{CountPercents(total, sourceData.totals['b'][index])}</div>
                            </div>
                        )
                    })}
                    {sourceGoalsData && <div className = 'tableCell'>
                        <div style = {{flex: '0.5'}}>{RounderN(sourceGoalsData['totals']['a'], 1)}</div>
                        <div style = {{flex: '1'}}>
                            {CountPercents(sourceGoalsData['totals']['a'], sourceGoalsData['totals']['b'])}
                        </div>
                    </div>}
                
                </div>

            {/* SECTIONS */}
                {sourceData && sourceGoalsData && show && sourceData.data.map(entry => {
                    return(
                        <div key = {entry.dimensions[0].name} className = 'tableRow'>
                            <div className = 'firstTableCellSub'>{entry.dimensions[0].name}</div>
                            {entry.metrics['a'].map((value, index) => {
                                return (
                                    <div className = 'tableCell' key = {entry.dimensions[0].name + index}>
                                        <div style = {{flex: '0.5'}}>{value ? RounderN(value, 1): 0}</div>
                                        <div style = {{flex: '1'}}>{CountPercents(value, entry.metrics['b'][index])}</div>
                                    </div>
                                    )
                            })}
                            {sourceGoalsData[entry.dimensions[0].name] ? 
                                <div className = 'tableCell'>
                                    <div style = {{flex: '0.5'}}>
                                        {sourceGoalsData[entry.dimensions[0].name] 
                                        ? RounderN(sourceGoalsData[entry.dimensions[0].name]['a'], 1): 0}
                                    </div>
                                    <div style = {{flex: '1'}}>
                                        {CountPercents(sourceGoalsData[entry.dimensions[0].name]['a'],
                                            sourceGoalsData[entry.dimensions[0].name]['b'])}
                                    </div>
                                </div>
                                : <div className = 'tableCell'>0</div>
                            }
                        </div>
                    ) 
                })}
        </>
    )
}

export default SourceTemplateComponent
