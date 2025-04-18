import {  z } from "zod";
import { createEmailContent,  getAllEmailContent, getEmailContentById, updateEmailContent } from "../../prisma/model/email_content/email_content.js";
const inputData=z.object({
    email_title:z.string(),
    email_subject:z.string(),
    email_body:z.string(),
    is_acitive:z.boolean().optional()
})
export  async function addEmailContent(req,userId){
    
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

//edit email content
export async function editEmailContent(userId,reqId,reqbody){
    try {
        const parsed=inputData.safeParse(reqbody);
        if(!parsed.success){
            throw new Error(parsed.error.issues.map(
                issue=>
                `${issue.path.join('.')}-${issue.message}`
            ).join(',')
            )
        }
        const validateEmailContent=parsed.data;
        const result=await updateEmailContent(userId,reqId,validateEmailContent);
        return result;
    } catch (e) {
        console.log(e.message)
        throw new Error(e.message)
    }
}