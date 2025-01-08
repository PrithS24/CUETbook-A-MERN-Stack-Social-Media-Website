'use client'
import React from 'react'
import {motion} from 'framer-motion'
const VideoCard=({post})=>{
    return(
        <div>
           <motion.div
           key={post?._id}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className='bg-white dark:bg-[rgb(36,37,38)] rounded-lg shadow-lg overflow-hidden'
           >
            <div>
                
            </div>
            </motion.div> 
        </div>
    )
}
export default VideoCard