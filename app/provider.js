"use client"
import { db } from '@/configs/db';
import { USER_TABLE } from '@/configs/schema';
import { useUser } from '@clerk/nextjs'
import axios from 'axios';
import { eq } from 'drizzle-orm';
import React, { useEffect } from 'react'

function Provider ({children}) {

const {user}=useUser();

useEffect(()=>{
   user&&CheckIsNewUser();
},[user])

    const CheckIsNewUser=async()=>{
        /*Check if user already exists 

        const result=await db.select().from(USER_TABLE)
        .where(eq(USER_TABLE.email,user?.primaryEmailAddress?.emailAddress))
        console.log(result);
        if(result?.length==0)
        {
             //Else add them to the database
            const userResp = await db.insert(USER_TABLE).values({
                name:user?.fullName,
                email:user?.primaryEmailAddress?.emailAddress
             }).returning({id:USER_TABLE.id})

        } */

        const resp=await axios.post('/api/create-user',{user:user});
        console.log(resp.data);
    }

  return (
    <div>
       {children}   
     </div>
  )

}

export default Provider 