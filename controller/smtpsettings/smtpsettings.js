import { z } from "zod";
import {createSmtp,  getAllSmtpEmails, getSmtpEmailById } from "../../prisma/model/smtpsettings/smtpsettings.js";

const InputData=z.object({
    smtp_host:z.string(),
    smtp_port:z.number(),
    smtp_server:z.string(),
    smtp_name:z.string(),
    smtp_email: z.string().email("Invalid Email"),
    smtp_password:z.string()
})

export  async function addSmtp(req,userId){
    try {
        const parsed=InputData.safeParse(req);
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(
              issue => `${issue.path.join('.')} - ${issue.message}`
            ).join(', '));
          }       
           const validateSmtpData=parsed.data;
        const result=await createSmtp(validateSmtpData,userId)
        return result;
    } catch (error) {
        throw new Error(error.message)
    }
}


export async function fetchAllSmtp(){
    try {
        const result=await getAllSmtpEmails();
        return result;
    } catch (e) {
        throw new Error(e.message)
    }
 
}

export async function fetchSmtpById(req){
    try {
        const result=await getSmtpEmailById(req);
        return result;
    } catch (e) {
        throw new Error(e.message)
    }
}