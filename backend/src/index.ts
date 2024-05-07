import { Hono } from 'hono';
import { userrouter} from './routes/User';
import cloudinary from "cloudinary";
import { blogrouter } from './routes/Blog';
import {cors} from 'hono/cors'

  

const app = new Hono<{Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
    CLOUDINARY_CLOUD_NAME:string
    CLOUDINARY_API_KEY:string
    CLOUDINARY_API_SECRET:string
}}>();
app.use('/*',cors());
              
app.route("api/v1/user",userrouter);
app.route("api/v1/blogs",blogrouter);
 


export default app
