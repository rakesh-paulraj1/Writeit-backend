import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from "hono";
import { updateBlogInput,createBlogInput } from '@rakeshpaulraj/medium-clone-types';
export const blogrouter = new Hono<{Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
},
Variables:{
    userId:string
}}>();





blogrouter.use("/*", async (c,next)=>{
    try{
const token = c.req.header('authorization')||"";
const user = await verify(token,c.env.JWT_SECRET);

if(user){
    c.set("userId",user.id);
   await  next();
}
else{
    c.status(401);
    c.json({error:"Unauthorized"})
}
    }catch(e){
        c.status(401);
        c.json({error:"Unauthorized or Inavlid User"})
    }
});


blogrouter.post('/', async (c) => {
    const body = await c.req.json();
    const success= createBlogInput.safeParse(body);
    if(!success.success){
        c.status(403);
        return c.json({error:"Invalid Input"});
    }
    
    const authorid=c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: Number(authorid)
        }
    });
    return c.json({
        id: blog.id,msg:"Created the Blog"
    });
})

blogrouter.put('/', async (c)=>{

    const body= await c.req.json ();
    const success=updateBlogInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({error:"Invalid Input"});
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());

     const blog = await prisma.blog.update({
        where:{
            id: body.id
        } ,
        data:{
            title:body.title,
            content:body.content,
           
        }
      })

 return c.json({msg:"Upadted the Blog"});
});

blogrouter.get('/bulk',async(c)=>{
  
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
      try{
     const blogs=  await prisma.blog.findMany({

        select:{
            id:true,
            title:true,
            content:true,
            author:{
                select:{
                    name:true
                }
            }
        }
     })
      return c.json({
        blogs
      });

  }catch(e){
      c.status(411);
      return c.json({error:"Blog not found"});}

  });


blogrouter.get('/:id', async(c)=>{
  const param=await c.req.param("id");
  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
    const blog = await prisma.blog.findFirst({
      where:{
          id:Number(param)
      },select:{
        title:true,
        content:true,
        author:{
            select:{
                name:true
            }
        }
      }
    })
    return c.json({
     blog:blog
    });
}catch(e){
    c.status(411);
    return c.json({error:" Particular Blog not found"});
}

})
  


  