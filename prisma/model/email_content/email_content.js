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
            updated_by:emailContent.adminside_user_email_content_updated_byToadminside_user?.name ||'No one updated',
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
                },
            }
        })
        if(!result){
            throw new Error("No email content found")
        }
       return ({
        ...result,
        created_by:result.adminside_user_email_content_created_byToadminside_user?.name,
        updated_by:result.adminside_user_email_content_updated_byToadminside_user?.name||'No one updated',
        adminside_user_email_content_created_byToadminside_user:undefined,
        adminside_user_email_content_updated_byToadminside_user:undefined
       })
    } catch (e) {
        throw new Error(e.message)
    }
}


export async function updateEmailContent(userId,reqId,reqbody){
    try {
       
        
      
       const result=await prisma.email_content.update({
        where:{
            id:Number(reqId)
        },
        data:{
        email_title:reqbody.email_title,
        email_subject:reqbody.email_subject,
        email_body:reqbody.email_body,
        updated_at:new Date(),
        updated_by:userId,
        is_active:reqbody.is_active==='true'?true:false,
        }
       })
       if(!result){
        throw new Error("Email content not Found")
       }
       return result;
    } catch (e) {
        throw new Error(e.message)
    }
}