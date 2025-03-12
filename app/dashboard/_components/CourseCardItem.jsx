import Image from 'next/image'
import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'

function CourseCardItem({course}) {
  return (
    <div className='border rounded-lg shadow-md p-5'>
      <div>
        <div className='flex justify-between items-center'>
          <Image src={'/knowledge.png'} alt='other'
           width={50} height={50}/>
           <h2 className='text-[10px] p-1 px-2 rounded-full bg-primary text-white'>11 March 2025</h2>
        </div>
        <h2 className='mt-3 font-medium text-lg'>{course?.courseLayout?.course_title}</h2>
        <p className='text-sm  line-clamp-2 text-gray-500 mt-2'>{course?.courseLayout?.course_summary}</p>

        <div className='mt-3'>
          <Progress value={0}/>
        </div>
        <div className='mt-3 flex justify-end cursor-pointer'>
          {course?.status=='Generating'?
          <h2 className='text-[12px] p-1 px-2 rounded-full bg-gray-700 text-white cur'>View Plan</h2>
          :<Button>View</Button>}
        </div>
      </div>
    </div>
  )
}

export default CourseCardItem