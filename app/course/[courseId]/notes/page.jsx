"use client"
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState();
  const [stepCount, setStepCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'notes'
    });
    setNotes(result?.data);
  };

  const totalSteps = notes?.length ?? 0;

  return notes && (
    <div>
      {/* Progress + Nav */}
      <div className='flex gap-5 items-center'>
        {stepCount !== 0 && (
          <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)}>
            Previous
          </Button>
        )}

        {notes?.map((_, index) => (
          <div
            key={index}
            className={`w-full h-2 rounded-full ${
              index < stepCount
                ? 'bg-primary'
                : index === stepCount
                ? 'bg-black'
                : 'bg-gray-200'
            }`}
          ></div>
        ))}

        {/* Only show "Next" if not beyond final screen */}
        {stepCount < totalSteps && (
          <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)}>
            Next
          </Button>
        )}
      </div>

      <div className='mt-10'>
        {/* 🧠 Notes Content with boundary */}
        {stepCount < totalSteps ? (
          <div className="p-6 border rounded-md shadow-sm bg-white">
            <div
              dangerouslySetInnerHTML={{
                __html: (notes[stepCount]?.notes || '')
                  .replace(/```html|```/g, '')
                  .replace(/\\n/g, '')
                  .trim()
              }}
            />
          </div>
        ) : (
          // 🎉 End of Notes Screen
          <div className='flex items-center gap-10 flex-col justify-center mt-10'>
            <h2 className="text-xl font-semibold">End of Notes</h2>
            <Button onClick={() => router.back()}>Go to Course Page</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewNotes;
