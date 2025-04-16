import prisma from '../../index.js';

export default async function createSmtp(req,userId) {
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