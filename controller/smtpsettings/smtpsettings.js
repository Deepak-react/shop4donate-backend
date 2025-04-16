import { z } from "zod";
import createSmtp from "../../prisma/model/smtpsettings/smtpsettings.js";

const InputData=z.object({
    smtp_host:z.string(),
    smtp_port:z.number(),
    smtp_server:z.string(),
    smtp_name:z.string(),
    smtp_email: z.string().email("Invalid Email"),
    smtp_password:z.string()
})

export default async function addSmtp(req,userId){
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