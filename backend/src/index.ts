import { Hono } from 'hono';
import { userrouter} from './routes/User';
import { blogrouter } from './routes/Blog';

const app = new Hono<{Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
}}>();
              
              
app.route("api/v1/user",userrouter);
app.route("api/v1/blogs",blogrouter);
 


export default app
