import { Hono } from 'hono';
import { userrouter} from './routes/User';
import cloudinary from "cloudinary";
import { blogrouter } from './routes/Blog';
import {cors} from 'hono/cors'
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

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
