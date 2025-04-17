import prisma from "../../index.js";

export  async function createEmailContent(req,userId){
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


export async function getAllEmailContent(){
    try {
        const result=await prisma.email_content.findMany({
            include:{
                adminside_user_email_content_created_byToadminside_user:{
                    select:{
                        name:true
                    }  
                },
                adminside_user_email_content_updated_byToadminside_user:{
                    select:{
                        name:true
                    }
                }
            }
        })
        if(!result) {
            throw new Error("No email content found")
        }
        return result.map((emailContent)=>({
            ...emailContent,
            created_by:emailContent.adminside_user_email_content_created_byToadminside_user?.name,
            updated_by:result.adminside_user_email_content_updated_byToadminside_user?.name || "No one updated",
            updated_at:result.updated_at?.updated_at||"Not updated yet",
            adminside_user_email_content_created_byToadminside_user:undefined,
            adminside_user_email_content_updated_byToadminside_user:undefined
        
        })
    )
    } catch (e) {
        throw new Error(e.message)
    }
}

export async function getEmailContentById(req){
    try {
        const result=await prisma.email_content.findUnique({
            where:{
                id:Number(req)
            },
                include:{
                adminside_user_email_content_created_byToadminside_user:{
                    select:{
                        name:true
                    }
                },
                adminside_user_email_content_updated_byToadminside_user:{
                    select:{
                        name:true
                    }
                }
            }
        })
        if(!result){
            throw new Error("No email content found")
        }
       return ({
        ...result,
        created_by:result.adminside_user_email_content_created_byToadminside_user?.name,
        updated_by:result.adminside_user_email_content_updated_byToadminside_user?.name || "No one updated",
        updated_at:result.updated_at?.updated_at||"Not updated yet",
        adminside_user_email_content_created_byToadminside_user:undefined,
        adminside_user_email_content_updated_byToadminside_user:undefined
       })
    } catch (e) {
        throw new Error(e.message)
    }
}