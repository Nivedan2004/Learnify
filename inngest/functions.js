import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const CreateNewUSer=inngest.createFunction(
    {id:'create-user'},
    {event:'user.create'},
    async({event,step}) =>{
        const {user}=event.data;
        //Get event data
        const result=await step.run('Check user and create new if not in database', async()=>{
             //Check if user already exists 

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
             return userResp;
        }
        return result;
        })

        return 'Success';
    }
    // Step to send Welcome Email Notification

    //To send Email Notification after 3 days once user sign's up
)