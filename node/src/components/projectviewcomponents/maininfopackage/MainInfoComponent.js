import React, { useContext } from 'react'
import '../../../styles/MainInfo.css'
import EfficiencyComponent from './EfficiencyComponent'
import PresentationComponent from './PresentationComponent'

const MainInfoComponent = () => {

    return (
        <div style = {{display: 'flex', justifyContent: 'space-between', marginBottom: '40px'}}>
            <PresentationComponent />
            <EfficiencyComponent />
        </div>
    )
}

export default MainInfoComponent
