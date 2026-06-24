import { useState, useEffect } from 'react';
import '../styles/puzzle.css'

function PointsProgress({ score, maxPoints , checkpoints }) {

    const percentage = maxPoints ? (score / maxPoints) * 100 : 0

    console.log('PointsProgress rendered')
    console.log('score:', score)
    console.log('maxPoints:', maxPoints)
    console.log('percentage:', percentage)

    let checkpointPercentages = checkpoints.map(c=> (c/maxPoints) * 100)


    return (
        <div className='progress-track'>
            <div className='progress-fill' style={{ width: `${percentage}%` }}></div>
            <div className='rocket' style={{ left: `${percentage}%` }}>🚀</div>
            <div className='checkpoint' style={{ left: `${checkpointPercentages[0]}%` }}>🌎</div>
            <div className='checkpoint' style={{ left: `${checkpointPercentages[1]}%` }}>🛰️</div>
            <div className='checkpoint' style={{ left: `${checkpointPercentages[2]}%` }}>🪐</div>
            <div className='checkpoint' style={{ left: `${checkpointPercentages[3]}%` }}>🛸</div>
            <div className='checkpoint' style={{ left: `${checkpointPercentages[4]}%` }}>👽</div>
            
        </div>
    )
}

export default PointsProgress;