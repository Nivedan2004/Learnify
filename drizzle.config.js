import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_Q0PzdVNRXOj2@ep-holy-art-a51bp62f-pooler.us-east-2.aws.neon.tech/learnify?sslmode=require'
  }
});
