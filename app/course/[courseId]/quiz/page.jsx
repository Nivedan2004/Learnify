"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StepProgress from '../_components/StepProgress';

function Quiz() {
    const {courseId}=useParams();
    const [quizData, setQuizData]=useState();
    const [stepCount,setStepCount]=useState(0);
    const [quiz,setQuiz]=useState([]);
    
    useEffect(()=>{
        GetQuiz()
    },[courseId])

    const GetQuiz=async()=>{
        console.log(courseId)
        const result=await axios.post('/api/study-type',{
            courseId:courseId,
            studyType:'Quiz'
        });

       setQuizData(result.data);
       setQuiz(result.data?.content?.questions)
        
    }
    return (
        <div>
            <h2 className='font-bold text-2xl text-center mb-4'>Quiz</h2>

            <StepProgress data={quiz} stepCount={stepCount} setStepCount={(value)=>setStepCount(value)} />

        </div>
    )
}

export default Quiz