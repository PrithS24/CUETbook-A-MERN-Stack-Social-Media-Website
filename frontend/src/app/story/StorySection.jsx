// import React from 'react'
import React, { useEffect, useState, useRef } from "react";
const StorySection = () => {
    const [scrollPosition,setScrollPosition] = useState(false)
    const [maxScroll,setMaxScroll] = useState(0)
    const containerRef = useRef()

    useEffect(() =>{
        const container = containerRef.current
        if(container){
            const updateMaxScroll = () =>{
                setMaxScroll(container.scrollWidth = container.offsetWidth)
                setScrollPosition(container.scrollLeft)
            }
            updateMaxScroll()
            window.addEventListener('resize',updateMaxScroll)
            return () => window.removeEventListener('resize',updateMaxScroll)
        }
    })
    return (
    <div>StorySection</div>
  )
}

export default StorySection