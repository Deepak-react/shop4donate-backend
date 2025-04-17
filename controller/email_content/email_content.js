import { z } from "zod";
import { createEmailContent,  getAllEmailContent, getEmailContentById } from "../../prisma/model/email_content/email_content.js";

export  async function addEmailContent(req,userId){
    const inputData=z.object({
        email_title:z.string(),
        email_subject:z.string(),
        email_body:z.string()
    })
    try {
        const parsed=inputData.safeParse(req);
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(
              issue => `${issue.path.join('.')} - ${issue.message}`
            ).join(', '));
          }
        const validateEmailContent=parsed.data;
        const result=await createEmailContent(validateEmailContent,userId);
        return result;
    } catch (error) {
        console.log("The error is",error.message)
        throw new Error(error.message)
    }
}

export async function fetchAllEmailContent() {
    try {
        const result=await getAllEmailContent();
        return result;
    } catch (e) {
        throw new Error(e.message)
    }
    
}

export async function  fetchEmailContent(req) {
    try {
        const result =await getEmailContentById(req)
        return result;
    } catch (e) {
        throw new Error(e.message)
    }
}

export async function fetchEContentById(req) {
     try {
        const result=await getEmailContentById(req)
        return result;
     } catch (e) {
        throw new Error(e.message)
     }
}