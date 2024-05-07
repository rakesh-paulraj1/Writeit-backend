import { decode, sign, verify } from 'hono/jwt'
import { Hono } from "hono";
import cloudinary from "cloudinary";

import { signininput,signupinput } from '@rakeshpaulraj/medium-clone-types';
export const userrouter = new Hono<{Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
},Variables:{
  userId:string
}}>();
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

userrouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
     datasourceUrl: c.env?.DATABASE_URL	,}).$extends(withAccelerate());
     const body = await c.req.json();
        const success=signupinput.safeParse(body); 
        if(!success.success){
            c.status(403);
            return c.json({error:"Invalid Input"});
        }
    
    try {
    const user = await prisma.user.create({
    data: {
    email: body.email,
    name:body.name,
    password: body.password,
    
    }
      });
     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
     const id=user.id;
     return c.json({ body:{
      jwt,id
     } });

     return c.text("Welcome!!");
    } catch(e) {
     c.status(403);
     return c.json({ error: "error while signing up" });
    }
     })

userrouter.post("/signin", async (c) => {
        const prisma = new PrismaClient({
          datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        
        const body = await c.req.json();
      try{
        const success=signininput.safeParse(body);
        if(!success){ 
          c.status(403);
            return c.json({error:"Invalid Input"});
        }
        const user = await prisma.user.findFirst({
          where: {

            email: body.email,
            password:body.password
          },
        });
        
        
        if (!user) {
          c.status(403);
          return c.json({ error: "Incorrect or User not found" });
        }
      
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        const id=user.id;
        return c.json({id,jwt});
      }
        catch(e){
          c.status(411);
          return c.text("Error on Signin")
        }
      })

userrouter.use("/profile", async (c, next) => {
        try {
          const token = c.req.header('authorization') || "";
          const user = await verify(token, c.env.JWT_SECRET);
      
          if (user) {
            await next();
          } else {
            c.status(401);
           return c.json({ error: "Unauthorized" });
          
            
          }
        } catch (e) {
          c.status(401);
           return c.json({ error: "Unauthorized or Invalid User" });
          
        }
      });
      


userrouter.get("/:id",async(c)=>{
 try {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
 const userid = 1;
 const user = await prisma.user.findUnique({
  where: {
    id: Number(userid)
  },
  include: {
    posts: true,
  }
});

if (!user) {
  c.status(404);
  return c.json({ error: "User not found" });
}

return c.json({ user });
} catch (e) {
console.error(e);
c.status(500);
return c.json({ error: "Internal server error" });
}
});

userrouter.put("/profile", async (c) => {
  try{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
 
  const updatedUser = await prisma.user.update({
    where: {
      id: body.id
    },
    data: {
      profile: {
        update: {
          public_id: body.public_id,
          url: body.url,
        }
      },
      bio: body.bio,
    }
  });
  

  c.status(200);
  return c.json({msg:"Profile Updated"});
}catch(error){
c.status(500);
console.log(error);
c.json("Interental Server Error");
}
})


      
      