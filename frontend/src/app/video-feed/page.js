import React from 'react'
import LeftSideBar from '../components/LeftSideBar'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import VideoCard from './VideoCard'
import Header from '../components/Header';
const page =()=>{
    const videoPosts=[{
       
            mediaUrl:"",
            mediaType:"video",
           
            comments:[{
                user:{
                    username:"Pritha",
                    text:"this is a video",
                    createdAt:"20-01-2025"
                }
            }]

        
    }]
    return(

        <div className='min-h-screen'>
             <Header/>
        
        <div className='mt-20'>
           

            <LeftSideBar/>
            <main className='ml-0 md:ml-64 p-6'>
                <Button variant="ghost" className="mb-4">
                    <ChevronLeft className='mr-2 h-4 w-4'/>
                    Back to feed

                </Button>
                <div className='max-w-3xl mx-auto'>
    {videoPosts.map((post) => (
        <VideoCard key={post.id} post={post} />
    ))}
</div>

            </main>
        </div>
        </div>
    )
}

export default page