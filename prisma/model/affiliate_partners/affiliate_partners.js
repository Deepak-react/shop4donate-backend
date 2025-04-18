
import prisma from "../../index.js";

export  async function createAffilatePartner(affilateData,userId){
    try {
    const createdUser=await prisma.adminside_user.findUnique({
        where:{
            id:userId
        }
    })
    const category=await prisma.categories.findFirst({
        where:{
            name:affilateData.category
        }
    })
    if(!createdUser) throw new Error("User id required");
    if(!category) throw new Error("catagory type not found")
        console.log("the data received in model",affilateData)
    return await prisma.affiliate_products.create({
    data:{
        affiliate_name  :affilateData.name,                                           
        logo : affilateData.logo,
        affiliate_link :affilateData.affiliate_link,
        total_revenue :Number(affilateData.total_revenue),
        category :category.id,
        created_by:createdUser.id
    }
    })

    } catch (error) {
        console.log("The error is",error.message)
        throw new Error(error.message);
    }
}

export async function getAllAffiliatePartners() {
    try {
      const result = await prisma.affiliate_products.findMany({
        include: {
          categories: {
            select: {
              name: true,
            },
          },
          adminside_user_affiliate_products_created_byToadminside_user: {
            select: {
              name: true,
            },
          },
          adminside_user_affiliate_products_updated_byToadminside_user: {
            select: {
              name: true,
            },
          },
        },
      });
  
      return result.map((affiliatePartner) => ({
        ...affiliatePartner,
        category: affiliatePartner.categories?.name,
        created_by:
          affiliatePartner.adminside_user_affiliate_products_created_byToadminside_user
            ?.name,
        updated_by:
          affiliatePartner.adminside_user_affiliate_products_updated_byToadminside_user
            ?.name,
        // Remove nested objects
        categories: undefined,
        adminside_user_affiliate_products_created_byToadminside_user: undefined,
        adminside_user_affiliate_products_updated_byToadminside_user: undefined,
      }));
    } catch (error) {
        console.log(error.message)
      throw new Error(error.message);
    }
  }
  
  export async function getAffiliPartnerById(req) {
    try {
      const result = await prisma.affiliate_products.findUnique({
        where: {
          id: Number(req),
        },
        include: {
          categories: {
            select: {
              name: true,
            },
          },
          adminside_user_affiliate_products_created_byToadminside_user: {
            select: {
              name: true,
            },
          },
          adminside_user_affiliate_products_updated_byToadminside_user: {
            select: {
              name: true,
            },
          },
        },
      });
  
      if (!result) throw new Error("Affiliate Partner not found");
  
      return {
        ...result,
        category: result.categories?.name,
        created_by:
          result.adminside_user_affiliate_products_created_byToadminside_user
            ?.name,
        updated_by:
          result.adminside_user_affiliate_products_updated_byToadminside_user
            ?.name,
        // Remove nested objects
        categories: undefined,
        adminside_user_affiliate_products_created_byToadminside_user: undefined,
        adminside_user_affiliate_products_updated_byToadminside_user: undefined,
      };
    } catch (e) {
      console.error("Error fetching affiliate partner by ID:", e.message);
      throw new Error(e.message);
    }
  }

//update affilate partners details
export async function updateAffiliPartner(reqUserId,reqId,reqbody){
  try {
    const category=await prisma.categories.findFirst({
      where:{
        name:reqbody.category
      },
    })
    if(!category){
      throw new Error("Category not found")
    }
  const result=await prisma.affiliate_products.update({
    where:{
      id:Number(reqId)
    },
    data:{
      affiliate_name:reqbody.name,
      logo:reqbody.logo,
      affiliate_link:reqbody.affiliate_link,
      total_revenue:Number(reqbody.total_revenue),
      updated_at:new Date(),
      category:category.id,
      updated_by:reqUserId,
      is_active:reqbody.is_active=='true'?true:false,
    }
    
  })
  if(!result){
    throw new Error("affiliate partner not found")
  }
  return result;
 }catch (e) {
  console.log(e.message)
    throw new Error(e.message)
  }
}