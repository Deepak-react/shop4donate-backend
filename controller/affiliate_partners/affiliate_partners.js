import { z } from "zod";
import {createAffilatePartner, getAffiliPartnerById, getAllAffiliatePartners } from "../../prisma/model/affiliate_partners/affiliate_partners.js";

const inputedData=z.object({
     name:z.string()
                   .min(5,"Enter atleast 5 character")
                   .max(20,"Maximum character length is 20"),
    logo:z.any(),
    affiliate_link:z.string(),
    total_revenue:z.string(),
    category:z.string(),
});

export  async function addAffilatePartner(affilateData,userId){
    try {
        const parsed=inputedData.safeParse(affilateData);
        console.log(" the passed data to the controller ", affilateData)
        if (!parsed.success) {
            throw new Error(parsed.error.issues.map(
              issue => `${issue.path.join('.')} - ${issue.message}`
            ).join(', '));
          }
        const validatedAffilateData=parsed.data;
        const result= await createAffilatePartner(validatedAffilateData,userId);
        return result;
    } catch (error) {
        throw new Error(error.message)
    }
}

export async function fetchAllAffiliPartner(){
  try {
    const result=await getAllAffiliatePartners();
    return result;
  } catch (e) {
    throw new Error(e.message)
    
  }
}

export async function fetchAffiliPartnerById(req){
  try {
    const result=await getAffiliPartnerById(req);
    return result;
  } catch (e) {
    throw new Error(e.message)
  }
}