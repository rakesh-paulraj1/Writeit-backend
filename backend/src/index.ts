import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
              }}>();

 
app.post('/api/v1/user/signup',async (c)=>{

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body=await c.req.json();
    await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: body.password,
        }
    })
})
app.post('/api/v1/user/signin', async (c)=>{
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body= await c.req.json();
   
    const user=prisma.user.findUniqueOrThrow({
        where: {
            email: body.email,
            password: body.password
                },
            })
                if(user){
                    const  token=  sign({ id: (await user).id }, c.env.JWT_SECRET)
                    return c.json({
                        jwt:token
                    })
                }
                c.json({
                    error: "invalid email or password"
                })

    })



app.post('/api/v1/blog',(c)=>{
  
})
app.put('/api/v1/blog',(c)=>{

  
})
app.get('/api/v1/blog/:id',(c)=>{
  

})

app.get('/api/v1/blog/bulk',(c)=>{
  
})





export default app
