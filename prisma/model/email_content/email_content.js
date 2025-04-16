import prisma from "../../index.js";

export default async function createEmailContent(req,userId){
    try {
        const createdUser=await prisma.adminside_user.findFirst({
            where:{
                id:userId
            }
        })
        if(!createdUser) throw new Error ("User id is missing")
        return await prisma.email_content.create({
           data:{
            email_title:req.email_title,
            email_subject:req.email_subject,
            email_body:req.email_body,
            created_by:createdUser.id
           }
           
    })
    } catch (error) {
        throw new Error(error.message)
    }
}