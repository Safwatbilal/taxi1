import React, { useEffect, useState } from "react"

const ProgressBar:React.FC<{Timer:number,timeout:()=>void}>=(props)=>{
    const [remainingTime,setRemainingTime]=useState<number>(props.Timer);
    useEffect(()=>{
        const setTimer=setTimeout(props.timeout, props.Timer);
        return ()=>{
            clearTimeout(setTimer);
        }
    },[props.Timer,props.timeout])
    useEffect(()=>{
        const interval=setInterval(() => {
            setRemainingTime((prevTime)=>prevTime-100)
        }, 100);
        return ()=>{
            clearInterval(interval);
        }
    },[])
    return <progress value={remainingTime} max={props.Timer} className="progress"/>
}
export default ProgressBar;