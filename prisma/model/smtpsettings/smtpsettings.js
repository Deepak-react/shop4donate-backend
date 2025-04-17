import prisma from '../../index.js';

export  async function createSmtp(req,userId) {
    try {
        const createdUser=await prisma.adminside_user.findFirst({
            where:{
                id:userId
            }
        })
        if(!createdUser) throw new Error ("User id  missing");
        return await prisma.smtp_settings.create({
            data:{
                smtp_host : req.smtp_host,
                smtp_port : req.smtp_port,
                smtp_server : req.smtp_server,
                smtp_name : req.smtp_name,
                smtp_email :req.smtp_email,
                smtp_password :req.smtp_password,
                created_by:createdUser.id
            }
        })
    } catch (error) {
        console.log("The error is ",error.message)
        throw new Error(error.message);
        
    }
}


export async function getAllSmtpEmails(req){
    try {
        const result=await prisma.smtp_settings.findMany({
            include:{
                adminside_user_smtp_settings_created_byToadminside_user:{
                    select:{
                        name:true
                    }
                },
                adminside_user_smtp_settings_updated_byToadminside_user:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return result.map((emails)=>({
            ...emails,
            created_by:emails.adminside_user_smtp_settings_created_byToadminside_user?.name,
            updated_by:emails.adminside_user_smtp_settings_updated_byToadminside_user?.name,
            adminside_user_smtp_settings_created_byToadminside_user:undefined,
            adminside_user_smtp_settings_updated_byToadminside_user:undefined
        })
        )
    
    } catch (e) {
        throw new Error(e.message)
    }
}


export async function getSmtpEmailById(req){
    try {
        const result=await prisma.smtp_settings.findUnique({
            where:{
                id:Number(req)
            },
                include:{
                    adminside_user_smtp_settings_created_byToadminside_user:{
                        select:{
                            name:true
                        }
                    },
                    adminside_user_smtp_settings_updated_byToadminside_user:{
                        select:{
                            name:true
                        }
                    }
            }
        })
         //check the id is valid 
         if(!result){
            throw new Error("SMTP not found ")
         }
        return {
            ...result,
            created_by:result.adminside_user_smtp_settings_created_byToadminside_user?.name,
            updated_by:result.adminside_user_smtp_settings_updated_byToadminside_user?.name,
            adminside_user_smtp_settings_created_byToadminside_user:undefined,
            adminside_user_smtp_settings_updated_byToadminside_user:undefined
        }
    } catch (e) {
 
        throw new Error(e.message)
    }
}